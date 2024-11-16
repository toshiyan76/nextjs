import React from 'react';
import Link from 'next/link';
import { Shield, HelpCircle, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ギルド情報 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-bold text-amber-500">冒険者ギルド</h3>
            </div>
            <p className="text-sm">
              冒険者たちが集い、クエストを受注する公式ギルドハウス。
              新たな冒険があなたを待っています。
            </p>
            <div className="flex gap-4">
              <Link 
                href="https://github.com" 
                className="hover:text-amber-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* ヘルプリンク */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-bold text-amber-500">ヘルプ & サポート</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/help/getting-started" className="hover:text-amber-500 transition-colors">
                  はじめての方へ
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-amber-500 transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/help/rules" className="hover:text-amber-500 transition-colors">
                  ギルドルール
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="hover:text-amber-500 transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* リーガル情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-amber-500">法的情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="hover:text-amber-500 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-amber-500 transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-amber-500 transition-colors">
                  Cookie方針
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            © {currentYear} Quest Board. All rights reserved.
            <br />
            <span className="text-amber-500">
              冒険者ギルド公認システム
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;