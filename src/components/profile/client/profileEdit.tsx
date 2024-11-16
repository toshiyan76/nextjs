'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface ProfileEditProps {
  initialUserData: User;
}

export default function ProfileEdit({ initialUserData }: ProfileEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User>(initialUserData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userData.avatar_url);

  // スキルの選択肢
  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL',
    'Problem Solving', 'Communication', 'Leadership'
  ];

  // アバター画像の処理
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // スキルの追加/削除
  const toggleSkill = (skill: string) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // プロフィール更新の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // アバター画像のアップロード処理
      let avatarUrl = userData.avatar_url;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const uploadResponse = await fetch('/api/profile/avatar', {
          method: 'POST',
          body: formData,
        });
        const { url } = await uploadResponse.json();
        avatarUrl = url;
      }

      // プロフィール情報の更新
      const response = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) throw new Error('Profile update failed');

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        variant: 'success',
      });

      router.push('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        {/* アバター設定セクション */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            src={previewUrl || '/default-avatar.png'}
            alt="Profile avatar"
            className="w-32 h-32"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="max-w-xs"
          />
        </div>

        {/* 基本情報セクション */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* スキルセクション */}
        <div>
          <label className="block text-sm font-medium mb-2">Skills</label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => (
              <Button
                key={skill}
                type="button"
                variant={userData.skills.includes(skill) ? "default" : "outline"}
                onClick={() => toggleSkill(skill)}
                className="text-sm"
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* レベルと経験値の表示 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Level {userData.level}</span>
            <span>{userData.experience} XP</span>
          </div>
          <Progress value={(userData.experience % 1000) / 10} />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}