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
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [rouletteOffset, setRouletteOffset] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const openCase = (caseItem: CaseItem) => {
    if (balance < caseItem.price) {
      alert('Недостаточно средств!');
      return;
    }

    setBalance(balance - caseItem.price);
    setIsOpening(true);
    setWonItem(null);
    setRouletteOffset(0);

    const items: CaseItem[] = [];
    for (let i = 0; i < 30; i++) {
      items.push(possibleItems[Math.floor(Math.random() * possibleItems.length)]);
    }
    const winningItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
    items[15] = winningItem;
    setRouletteItems(items);

    setTimeout(() => {
      setRouletteOffset(-15 * 160 - 80 + Math.random() * 30 - 15);
    }, 50);

    setTimeout(() => {
      setWonItem(winningItem);
      
      if (winningItem.rarity === 'legendary') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      const existingItem = inventory.find(item => item.id === winningItem.id);
      if (existingItem) {
        setInventory(inventory.map(item => 
          item.id === winningItem.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setInventory([...inventory, { ...winningItem, quantity: 1 }]);
      }
      
      setIsOpening(false);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 glow-gold';
      case 'epic': return 'text-purple-400 glow-purple';
      case 'rare': return 'text-blue-400';
      default: return 'text-orange-400 glow-orange';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 border-glow-gold';
      case 'epic': return 'border-purple-400 border-glow-purple';
      case 'rare': return 'border-blue-400';
      default: return 'border-orange-400 border-glow-orange';
    }
  };

  const sellItem = (item: InventoryItem) => {
    const sellPrice = Math.floor(item.price * 0.7);
    setBalance(balance + sellPrice);
    
    if (item.quantity > 1) {
      setInventory(inventory.map(invItem => 
        invItem.id === item.id ? { ...invItem, quantity: invItem.quantity - 1 } : invItem
      ));
    } else {
      setInventory(inventory.filter(invItem => invItem.id !== item.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 165, 0, 0.1), transparent 50%)' }}>
<header className="border-b border-orange-500/30 bg-[#1a1f2e]/95 backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-orange-500/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎰</div>
              <div>
                <h1 className="text-3xl font-bold glow-orange tracking-tight">MAJESTIC CASES</h1>
                <p className="text-xs text-orange-400/80">GTA 5 RP • Case Opening</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-orange-500/10 px-5 py-2.5 rounded-lg border border-orange-500/30">
                <Icon name="DollarSign" className="text-orange-400" size={20} />
                <span className="text-2xl font-bold text-orange-400">{balance.toLocaleString()}</span>
              </div>
              
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-orange-500/20">
                <Icon name="Plus" size={18} className="mr-2" />
                Пополнить
              </Button>

              <Button 
                onClick={() => setIsAdmin(!isAdmin)}
                variant="outline"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                <Icon name="Settings" size={18} className="mr-2" />
                {isAdmin ? 'Выход' : 'Админ'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#1a1f2e]/50 border-b border-orange-500/20 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'home', icon: 'Home', label: 'Главная' },
              { id: 'cases', icon: 'Package', label: 'Кейсы' },
              { id: 'inventory', icon: 'Backpack', label: 'Инвентарь' },
              { id: 'rating', icon: 'Trophy', label: 'Рейтинг' },
              ...(isAdmin ? [{ id: 'admin', icon: 'Shield', label: 'Админ-панель' }] : []),
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
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-orange-300'
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
        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold glow-orange">АДМИН-ПАНЕЛЬ</h2>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500 text-lg px-4 py-2">
                <Icon name="Shield" size={16} className="mr-2" />
                Администратор
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Users" className="text-orange-400" size={24} />
                  <h3 className="text-xl font-bold text-orange-400">Пользователи</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-sm text-gray-400">Всего пользователей</p>
                  <Button className="w-full mt-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500">
                    Управление
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Package" className="text-orange-400" size={24} />
                  <h3 className="text-xl font-bold text-orange-400">Кейсы</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-white">12,543</p>
                  <p className="text-sm text-gray-400">Открыто кейсов</p>
                  <Button className="w-full mt-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500">
                    Статистика
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="DollarSign" className="text-orange-400" size={24} />
                  <h3 className="text-xl font-bold text-orange-400">Доход</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-white">$2.4M</p>
                  <p className="text-sm text-gray-400">За месяц</p>
                  <Button className="w-full mt-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500">
                    Отчеты
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Управление кейсами</h3>
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <div key={caseItem.id} className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg border border-orange-500/20">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{caseItem.image}</div>
                      <div>
                        <h4 className="font-bold text-white">{caseItem.name}</h4>
                        <p className="text-sm text-gray-400">{caseItem.rarity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-orange-400">${caseItem.price}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить новый кейс
                </Button>
              </div>
            </Card>

            <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Последние транзакции</h3>
              <div className="space-y-2">
                {[
                  { user: 'Vladimir_K', action: 'Открыл VIP Pack', amount: -1000, time: '2 мин назад' },
                  { user: 'Dmitry_I', action: 'Пополнил баланс', amount: +5000, time: '5 мин назад' },
                  { user: 'Sergey_P', action: 'Продал Lamborghini', amount: +7000, time: '12 мин назад' },
                  { user: 'Alex_S', action: 'Открыл Legend Pack', amount: -5000, time: '18 мин назад' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#0f1419] rounded border border-orange-500/10">
                    <div>
                      <p className="font-semibold text-white">{tx.user}</p>
                      <p className="text-sm text-gray-400">{tx.action}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}$
                      </p>
                      <p className="text-xs text-gray-500">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {(activeTab === 'home' || activeTab === 'cases') && (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-majestic border border-orange-500/30 p-8 animate-fade-in shadow-lg shadow-orange-500/5">
              <div className="relative z-10">
                <h2 className="text-5xl font-bold mb-4 glow-orange tracking-tight">ОТКРОЙ СВОЙ КЕЙС</h2>
                <p className="text-xl text-gray-300 mb-6">Получи легендарные предметы из мира GTA 5 Majestic RP</p>
                <div className="flex gap-4">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500 text-lg px-4 py-2">
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
              <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-8">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold glow-orange text-center mb-4">ОТКРЫВАЕМ КЕЙС...</h3>
                  
                  <div className="relative h-40 overflow-hidden rounded-lg border-2 border-orange-500/50 bg-gradient-to-r from-[#0f1419] via-orange-500/10 to-[#0f1419]">
                    <div className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-orange-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
                    
                    <div 
                      className="flex gap-3 absolute top-1/2 -translate-y-1/2 will-change-transform"
                      style={{ 
                        transform: `translateX(calc(50% + ${rouletteOffset}px)) translateY(-50%)`,
                        transition: rouletteOffset !== 0 ? 'transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                      }}
                    >
                      {rouletteItems.map((item, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-32 h-32 rounded border ${getRarityBorder(item.rarity)} bg-[#1a1f2e]/90 flex flex-col items-center justify-center gap-1 p-2`}
                        >
                          <div className="text-4xl">{item.image}</div>
                          <div className={`text-xs font-bold ${getRarityColor(item.rarity)} text-center line-clamp-1`}>
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-orange-400">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </Card>
            )}

{wonItem && !isOpening && (
              <Card className={`bg-black/80 border-4 ${getRarityBorder(wonItem.rarity)} p-8 text-center animate-scale-in relative overflow-hidden`}>
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 animate-[fall_3s_linear_forwards]"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: '-10px',
                          backgroundColor: ['#ffd700', '#00ff41', '#9b59b6', '#0ea5e9'][Math.floor(Math.random() * 4)],
                          animationDelay: `${Math.random() * 0.5}s`,
                          transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="space-y-4 relative z-10">
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
              <h3 className="text-3xl font-bold mb-6 glow-orange">ДОСТУПНЫЕ КЕЙСЫ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`bg-gradient-gta border-2 ${getRarityBorder(caseItem.rarity)} p-6 hover:scale-105 transition-all cursor-pointer shadow-lg hover:shadow-xl`}
                  >
                    <div className="text-center space-y-4">
                      <div className="text-7xl">{caseItem.image}</div>
                      <h4 className={`text-2xl font-bold ${getRarityColor(caseItem.rarity)}`}>
                        {caseItem.name}
                      </h4>
                      <Badge className={`${getRarityColor(caseItem.rarity)} text-lg px-4 py-1`}>
                        {caseItem.rarity.toUpperCase()}
                      </Badge>
                      <div className="text-3xl font-bold text-orange-400">
                        ${caseItem.price.toLocaleString()}
                      </div>
                      <Button
                        onClick={() => openCase(caseItem)}
                        disabled={isOpening || balance < caseItem.price}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-6 shadow-lg shadow-orange-500/20"
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
            <h2 className="text-4xl font-bold glow-orange">МОЙ ИНВЕНТАРЬ</h2>
            {inventory.length === 0 ? (
              <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-12 text-center">
                <Icon name="PackageX" size={64} className="mx-auto mb-4 text-gray-500" />
                <p className="text-xl text-gray-400">Ваш инвентарь пуст. Откройте кейсы!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <Card key={item.id} className={`bg-[#1a1f2e]/80 border-2 ${getRarityBorder(item.rarity)} p-4`}>
                    <div className="text-center space-y-2">
                      <div className="text-5xl">{item.image}</div>
                      <h4 className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</h4>
                      <p className="text-orange-400">${item.price.toLocaleString()}</p>
                      <Badge className="bg-gray-700">x{item.quantity}</Badge>
                      <Button 
                        onClick={() => sellItem(item)}
                        className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500"
                      >
                        <Icon name="DollarSign" size={16} className="mr-1" />
                        Продать за ${Math.floor(item.price * 0.7).toLocaleString()}
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
            <h2 className="text-4xl font-bold glow-orange">ТОП ИГРОКОВ</h2>
            <Card className="bg-[#1a1f2e]/80 border-orange-500/30">
              <div className="divide-y divide-orange-500/20">
                {leaderboard.map((player, index) => (
                  <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-orange-500/10 transition-colors">
                    <div className={`text-3xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                      #{index + 1}
                    </div>
                    <div className="text-4xl">{player.avatar}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-orange-400">{player.name}</h4>
                      <p className="text-gray-400">Уровень {player.level}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{player.wins}</div>
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
            <h2 className="text-4xl font-bold glow-orange">ПРАВИЛА</h2>
            <Card className="bg-[#1a1f2e]/80 border-orange-500/30 p-6">
              <div className="space-y-4 text-lg">
                <div className="flex gap-3">
                  <Icon name="Check" className="text-orange-400 mt-1" />
                  <p>Запрещено использование читов и сторонних программ</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-orange-400 mt-1" />
                  <p>Один аккаунт на одного игрока</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-orange-400 mt-1" />
                  <p>Вывод предметов только через официальную систему</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-orange-400 mt-1" />
                  <p>Соблюдайте уважительное отношение к другим игрокам</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-orange-400 mt-1" />
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