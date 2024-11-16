import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

// バリデーションスキーマの定義
const authSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(100),
  role: z.enum(['ADVENTURER', 'CLIENT']),
  name: z.string().min(2, '名前は2文字以上である必要があります').optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      role: 'ADVENTURER',
    },
  });

  const onSubmitHandler = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: mode === 'login' ? 'ログイン成功' : '登録成功',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: error instanceof Error ? error.message : '不明なエラー',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-4 w-full max-w-md"
    >
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="メールアドレス"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="パスワード"
          {...register('password')}
          error={errors.password?.message}
        />
        
        {mode === 'signup' && (
          <>
            <Input
              type="text"
              placeholder="名前"
              {...register('name')}
              error={errors.name?.message}
            />
            <div className="space-y-1">
              <label className="text-sm font-medium">役割を選択</label>
              <select
                {...register('role')}
                className="w-full p-2 border rounded-md"
              >
                <option value="ADVENTURER">冒険者</option>
                <option value="CLIENT">依頼者</option>
              </select>
              {errors.role?.message && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner" />
        ) : mode === 'login' ? (
          'ログイン'
        ) : (
          '登録'
        )}
      </Button>
    </form>
  );
}