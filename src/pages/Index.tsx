import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CaseItem {
  id: number;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  color: string;
}

interface InventoryItem extends CaseItem {
  quantity: number;
}

const cases: CaseItem[] = [
  { id: 1, name: 'Starter Pack', image: '🎁', rarity: 'common', price: 100, color: '#00ff41' },
  { id: 2, name: 'Street Pack', image: '🔫', rarity: 'rare', price: 500, color: '#0ea5e9' },
  { id: 3, name: 'VIP Pack', image: '💎', rarity: 'epic', price: 1000, color: '#9b59b6' },
  { id: 4, name: 'Legend Pack', image: '👑', rarity: 'legendary', price: 5000, color: '#ffd700' },
  { id: 5, name: 'Gang Pack', image: '🏴', rarity: 'rare', price: 750, color: '#e74c3c' },
  { id: 6, name: 'Business Pack', image: '💼', rarity: 'epic', price: 2000, color: '#f39c12' },
];

const possibleItems: CaseItem[] = [
  { id: 101, name: 'Desert Eagle', image: '🔫', rarity: 'common', price: 50, color: '#00ff41' },
  { id: 102, name: 'Lamborghini', image: '🏎️', rarity: 'legendary', price: 10000, color: '#ffd700' },
  { id: 103, name: 'Penthouse', image: '🏢', rarity: 'epic', price: 5000, color: '#9b59b6' },
  { id: 104, name: 'Gold Chain', image: '⛓️', rarity: 'rare', price: 500, color: '#0ea5e9' },
  { id: 105, name: 'Cash Stack', image: '💵', rarity: 'common', price: 100, color: '#00ff41' },
  { id: 106, name: 'Yacht', image: '🛥️', rarity: 'legendary', price: 15000, color: '#ffd700' },
];

const leaderboard = [
  { id: 1, name: 'Vladimir_Kowalski', wins: 1247, avatar: '👑', level: 99 },
  { id: 2, name: 'Dmitry_Ivanov', wins: 1105, avatar: '💎', level: 87 },
  { id: 3, name: 'Sergey_Petrov', wins: 998, avatar: '🏆', level: 76 },
  { id: 4, name: 'Alex_Sidorov', wins: 856, avatar: '⭐', level: 65 },
  { id: 5, name: 'Igor_Smirnov', wins: 743, avatar: '🎯', level: 54 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState(10000);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);

  const openCase = (caseItem: CaseItem) => {
    if (balance < caseItem.price) {
      alert('Недостаточно средств!');
      return;
    }

    setBalance(balance - caseItem.price);
    setIsOpening(true);
    setWonItem(null);

    setTimeout(() => {
      const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
      setWonItem(randomItem);
      
      const existingItem = inventory.find(item => item.id === randomItem.id);
      if (existingItem) {
        setInventory(inventory.map(item => 
          item.id === randomItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setInventory([...inventory, { ...randomItem, quantity: 1 }]);
      }
      
      setIsOpening(false);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 glow-gold';
      case 'epic': return 'text-purple-400 glow-purple';
      case 'rare': return 'text-blue-400';
      default: return 'text-green-400 glow-green';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 border-glow-gold';
      case 'epic': return 'border-purple-400 border-glow-purple';
      case 'rare': return 'border-blue-400';
      default: return 'border-green-400 border-glow-green';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="border-b border-green-500/30 bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎰</div>
              <div>
                <h1 className="text-3xl font-bold glow-green">MAJESTIC CASES</h1>
                <p className="text-xs text-green-400">GTA 5 RP • Case Opening</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded border border-green-500/50">
                <Icon name="DollarSign" className="text-green-400" size={20} />
                <span className="text-2xl font-bold text-green-400">{balance.toLocaleString()}</span>
              </div>
              
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold">
                <Icon name="Plus" size={18} className="mr-2" />
                Пополнить
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-black/30 border-b border-green-500/20 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'home', icon: 'Home', label: 'Главная' },
              { id: 'cases', icon: 'Package', label: 'Кейсы' },
              { id: 'inventory', icon: 'Backpack', label: 'Инвентарь' },
              { id: 'rating', icon: 'Trophy', label: 'Рейтинг' },
              { id: 'rules', icon: 'BookOpen', label: 'Правила' },
              { id: 'faq', icon: 'HelpCircle', label: 'FAQ' },
              { id: 'support', icon: 'MessageCircle', label: 'Поддержка' },
              { id: 'profile', icon: 'User', label: 'Профиль' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-gray-400 hover:text-green-300'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {(activeTab === 'home' || activeTab === 'cases') && (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500/20 via-purple-500/20 to-yellow-500/20 border border-green-500/50 p-8 animate-fade-in">
              <div className="relative z-10">
                <h2 className="text-5xl font-bold mb-4 glow-green">ОТКРОЙ СВОЙ КЕЙС</h2>
                <p className="text-xl text-gray-300 mb-6">Получи легендарные предметы из мира GTA 5 Majestic RP</p>
                <div className="flex gap-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500 text-lg px-4 py-2">
                    <Icon name="Zap" size={16} className="mr-2" />
                    Мгновенная выдача
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500 text-lg px-4 py-2">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Честная система
                  </Badge>
                </div>
              </div>
            </div>

            {isOpening && (
              <Card className="bg-black/80 border-green-500 p-8 text-center">
                <div className="space-y-6">
                  <div className="text-6xl animate-pulse">🎰</div>
                  <h3 className="text-3xl font-bold glow-green">ОТКРЫВАЕМ КЕЙС...</h3>
                  <Progress value={66} className="h-2" />
                </div>
              </Card>
            )}

            {wonItem && !isOpening && (
              <Card className={`bg-black/80 border-4 ${getRarityBorder(wonItem.rarity)} p-8 text-center animate-scale-in`}>
                <div className="space-y-4">
                  <div className="text-8xl">{wonItem.image}</div>
                  <h3 className={`text-4xl font-bold ${getRarityColor(wonItem.rarity)}`}>
                    {wonItem.name}
                  </h3>
                  <Badge className={`text-xl px-6 py-2 ${getRarityColor(wonItem.rarity)}`}>
                    {wonItem.rarity.toUpperCase()}
                  </Badge>
                  <p className="text-2xl text-green-400">Стоимость: ${wonItem.price.toLocaleString()}</p>
                  <Button 
                    onClick={() => setWonItem(null)}
                    className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-6"
                  >
                    Продолжить
                  </Button>
                </div>
              </Card>
            )}

            <div>
              <h3 className="text-3xl font-bold mb-6 glow-green">ДОСТУПНЫЕ КЕЙСЫ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`bg-gradient-gta border-2 ${getRarityBorder(caseItem.rarity)} p-6 hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-7xl">{caseItem.image}</div>
                      <h4 className={`text-2xl font-bold ${getRarityColor(caseItem.rarity)}`}>
                        {caseItem.name}
                      </h4>
                      <Badge className={`${getRarityColor(caseItem.rarity)} text-lg px-4 py-1`}>
                        {caseItem.rarity.toUpperCase()}
                      </Badge>
                      <div className="text-3xl font-bold text-green-400">
                        ${caseItem.price.toLocaleString()}
                      </div>
                      <Button
                        onClick={() => openCase(caseItem)}
                        disabled={isOpening || balance < caseItem.price}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold text-lg py-6"
                        style={{ borderColor: caseItem.color }}
                      >
                        <Icon name="Unlock" size={20} className="mr-2" />
                        Открыть кейс
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">МОЙ ИНВЕНТАРЬ</h2>
            {inventory.length === 0 ? (
              <Card className="bg-black/50 border-green-500/30 p-12 text-center">
                <Icon name="PackageX" size={64} className="mx-auto mb-4 text-gray-500" />
                <p className="text-xl text-gray-400">Ваш инвентарь пуст. Откройте кейсы!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <Card key={item.id} className={`bg-black/80 border-2 ${getRarityBorder(item.rarity)} p-4`}>
                    <div className="text-center space-y-2">
                      <div className="text-5xl">{item.image}</div>
                      <h4 className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</h4>
                      <p className="text-green-400">${item.price.toLocaleString()}</p>
                      <Badge className="bg-gray-700">x{item.quantity}</Badge>
                      <Button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500">
                        Продать
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rating' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">ТОП ИГРОКОВ</h2>
            <Card className="bg-black/50 border-green-500/30">
              <div className="divide-y divide-green-500/20">
                {leaderboard.map((player, index) => (
                  <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-green-500/10 transition-colors">
                    <div className={`text-3xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                      #{index + 1}
                    </div>
                    <div className="text-4xl">{player.avatar}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-green-400">{player.name}</h4>
                      <p className="text-gray-400">Уровень {player.level}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">{player.wins}</div>
                      <p className="text-sm text-gray-400">побед</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">ПРАВИЛА</h2>
            <Card className="bg-black/50 border-green-500/30 p-6">
              <div className="space-y-4 text-lg">
                <div className="flex gap-3">
                  <Icon name="Check" className="text-green-400 mt-1" />
                  <p>Запрещено использование читов и сторонних программ</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-green-400 mt-1" />
                  <p>Один аккаунт на одного игрока</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-green-400 mt-1" />
                  <p>Вывод предметов только через официальную систему</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-green-400 mt-1" />
                  <p>Соблюдайте уважительное отношение к другим игрокам</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-green-400 mt-1" />
                  <p>Администрация оставляет за собой право блокировки аккаунта при нарушении правил</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">ЧАСТЫЕ ВОПРОСЫ</h2>
            <Card className="bg-black/50 border-green-500/30 p-6">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-green-500/30">
                  <AccordionTrigger className="text-lg text-green-400 hover:text-green-300">
                    Как пополнить баланс?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Нажмите на кнопку "Пополнить" в верхнем правом углу и выберите удобный способ оплаты.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-green-500/30">
                  <AccordionTrigger className="text-lg text-green-400 hover:text-green-300">
                    Как получить выигранные предметы?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Все предметы автоматически добавляются в ваш инвентарь. Вы можете продать их или вывести на сервер.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-green-500/30">
                  <AccordionTrigger className="text-lg text-green-400 hover:text-green-300">
                    Какие шансы выпадения предметов?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Legendary: 5%, Epic: 15%, Rare: 30%, Common: 50%. Система полностью честная и прозрачная.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-green-500/30">
                  <AccordionTrigger className="text-lg text-green-400 hover:text-green-300">
                    Можно ли вернуть деньги?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    Возврат средств возможен в течение 24 часов, если кейсы не были открыты.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">ПОДДЕРЖКА</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-green-500/30 p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Написать в поддержку</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Ваше имя" 
                    className="w-full bg-black/50 border border-green-500/30 rounded px-4 py-3 text-white"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full bg-black/50 border border-green-500/30 rounded px-4 py-3 text-white"
                  />
                  <textarea 
                    placeholder="Опишите вашу проблему" 
                    rows={5}
                    className="w-full bg-black/50 border border-green-500/30 rounded px-4 py-3 text-white"
                  />
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-black/50 border-green-500/30 p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Контакты</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded">
                    <Icon name="Mail" className="text-green-400" />
                    <span>support@majestic-cases.ru</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded">
                    <Icon name="MessageCircle" className="text-green-400" />
                    <span>Telegram: @majestic_support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded">
                    <Icon name="Clock" className="text-green-400" />
                    <span>Время работы: 24/7</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold glow-green">МОЙ ПРОФИЛЬ</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-black/50 border-green-500/30 p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-green-500">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-5xl bg-green-500/20">👤</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Player_Name</h3>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500 text-lg px-4 py-1">
                  Уровень 42
                </Badge>
              </Card>
              
              <Card className="bg-black/50 border-green-500/30 p-6 md:col-span-2">
                <h3 className="text-2xl font-bold text-green-400 mb-4">Статистика</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-4 rounded">
                    <div className="text-3xl font-bold text-green-400">156</div>
                    <p className="text-gray-400">Открыто кейсов</p>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded">
                    <div className="text-3xl font-bold text-purple-400">43</div>
                    <p className="text-gray-400">Предметов в инвентаре</p>
                  </div>
                  <div className="bg-yellow-500/10 p-4 rounded">
                    <div className="text-3xl font-bold text-yellow-400">$45,230</div>
                    <p className="text-gray-400">Потрачено</p>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded">
                    <div className="text-3xl font-bold text-blue-400">12</div>
                    <p className="text-gray-400">Legendary предметов</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-green-500/30 bg-black/50 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-lg">© 2024 Majestic Cases • GTA 5 RP</p>
          <p className="text-sm mt-2">Играйте ответственно • 18+</p>
        </div>
      </footer>
    </div>
  );
}