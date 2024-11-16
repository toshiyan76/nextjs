'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/client/authForm';
import { signUp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toast';

// 初期スキルの選択肢
const INITIAL_SKILLS = [
  { id: 'combat', label: '戦闘術', description: '基本的な戦闘能力' },
  { id: 'magic', label: '魔法', description: '初級魔法の使用' },
  { id: 'craft', label: '工芸', description: '基本的な装備の製作・修理' },
  { id: 'scout', label: '索敵', description: '基本的な情報収集能力' },
];

const SignUpPage: FC = () => {
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<'adventurer' | 'client'>('adventurer');

  const handleSignUp = async (formData: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      if (!agreedToTerms) {
        toast({
          title: 'エラー',
          description: 'ギルド規約に同意してください',
          variant: 'destructive',
        });
        return;
      }

      if (userRole === 'adventurer' && selectedSkills.length === 0) {
        toast({
          title: 'エラー',
          description: '少なくとも1つのスキルを選択してください',
          variant: 'destructive',
        });
        return;
      }

      const userData = {
        ...formData,
        role: userRole,
        skills: selectedSkills,
        level: 1,
        experience: 0,
      };

      await signUp(userData);
      toast({
        title: '登録完了',
        description: 'アカウントが作成されました',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'エラー',
        description: '登録に失敗しました',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">冒険者ギルド登録</h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            variant={userRole === 'adventurer' ? 'default' : 'outline'}
            onClick={() => setUserRole('adventurer')}
          >
            冒険者として登録
          </Button>
          <Button
            variant={userRole === 'client' ? 'default' : 'outline'}
            onClick={() => setUserRole('client')}
          >
            依頼者として登録
          </Button>
        </div>

        <AuthForm
          mode="signup"
          onSubmit={handleSignUp}
          buttonText="ギルド登録"
        />

        {userRole === 'adventurer' && (
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold mb-4">初期スキル選択</h3>
            <div className="space-y-2">
              {INITIAL_SKILLS.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill.id}
                    checked={selectedSkills.includes(skill.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSkills([...selectedSkills, skill.id]);
                      } else {
                        setSelectedSkills(selectedSkills.filter(id => id !== skill.id));
                      }
                    }}
                  />
                  <label htmlFor={skill.id} className="text-sm">
                    {skill.label} - {skill.description}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm">
            <span className="cursor-pointer text-blue-500" onClick={() => setShowTerms(true)}>
              ギルド規約
            </span>
            に同意します
          </label>
        </div>

        <Dialog open={showTerms} onOpenChange={setShowTerms}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>冒険者ギルド規約</DialogTitle>
            </DialogHeader>
            <div className="prose max-w-none">
              <p>1. 全ての冒険者は、ギルドの規則を遵守しなければならない。</p>
              <p>2. 依頼の受注と完了に関する責任を負うこと。</p>
              <p>3. ギルド内での争いは禁止する。</p>
              {/* 規約の詳細を追加 */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SignUpPage;