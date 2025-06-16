// battle-calculator.js - 專用戰鬥計算器
const BattleDamageCalculator = () => {
  const [selectedPartner, setSelectedPartner] = React.useState('');
  const [selectedProfession, setSelectedProfession] = React.useState('');
  const [selectedWeapon, setSelectedWeapon] = React.useState('');
  const [bondLevel, setBondLevel] = React.useState(25);
  const [selectedCards, setSelectedCards] = React.useState(Array(6).fill(null));
  const [cardLevels, setCardLevels] = React.useState(Array(6).fill(80));
  const [cardBreakthroughs, setCardBreakthroughs] = React.useState(Array(6).fill(1));
  const [cardAdvancements, setCardAdvancements] = React.useState(Array(6).fill(3));
  const [cardCores, setCardCores] = React.useState(Array(6).fill({}));
  const [constellationMatch, setConstellationMatch] = React.useState(0);
  const [perfectAlignment, setPerfectAlignment] = React.useState(false);
  
  const [teamStats, setTeamStats] = React.useState(null);
  const [skillDamage, setSkillDamage] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('config');

  // 等待 calc 載入
  const [calcReady, setCalcReady] = React.useState(false);
  
  React.useEffect(() => {
    const checkCalc = () => {
      if (window.calc && window.calc.getAllPartners) {
        setCalcReady(true);
      } else {
        setTimeout(checkCalc, 100);
      }
    };
    checkCalc();
  }, []);

  // 獲取數據
  const partners = calcReady ? (window.calc.getAllPartners() || []) : [];
  const professions = calcReady && selectedPartner ? (window.calc.getProfessions(selectedPartner) || []) : [];
  const weapons = calcReady && selectedProfession ? (window.calc.getWeapons(selectedProfession) || []) : [];
  const availableCards = calcReady && selectedPartner ? (window.calc.getCards(selectedPartner) || []) : [];

  // 計算隊伍屬性
  const calculateTeamStats = () => {
    if (!calcReady || !selectedCards.some(card => card !== null)) return;
    
    try {
      const teamConfig = {
        cardNames: selectedCards.map(card => card?.name).filter(Boolean),
        levels: cardLevels,
        breakthroughs: cardBreakthroughs,
        advancements: cardAdvancements,
        partnerBondLevel: bondLevel,
        userConstellationMatch: constellationMatch,
        userPerfectAlignment: perfectAlignment
      };
      
      const stats = window.calc.calculateTeam(teamConfig);
      setTeamStats(stats);
      
      // 計算技能傷害
      if (selectedProfession && stats) {
        const damage = calculateSkillDamage(stats);
        setSkillDamage(damage);
      }
    } catch (error) {
      console.error('計算錯誤:', error);
    }
  };

  // 計算技能傷害（基於職業的實際倍率）
  const calculateSkillDamage = (stats) => {
    const baseAtk = stats.atk;
    const critRate = stats.criticalRate;
    const critDamage = stats.criticalDamage;
    const weaknessDamage = stats.weaknessDamage;
    
    // 根據職業獲取技能倍率
    const getSkillMultipliers = (professionId) => {
      const multipliers = {
        'eternal_prophet': { basicAttack: 0.8, skill1: 2.2, skill2: 3.8, ultimate: 5.5 },
        'jiuli_commander': { basicAttack: 1.0, skill1: 2.5, skill2: 4.2, ultimate: 6.0 },
        'endless_raider': { basicAttack: 0.9, skill1: 2.3, skill2: 4.0, ultimate: 5.8 },
        'abyss_master': { basicAttack: 0.7, skill1: 2.0, skill2: 3.5, ultimate: 5.2 },
        'light_chaser': { basicAttack: 1.1, skill1: 2.4, skill2: 4.1, ultimate: 6.2 },
        'light_hunter': { basicAttack: 0.8, skill1: 2.1, skill2: 3.7, ultimate: 5.4 },
        'fleet_officer': { basicAttack: 0.9, skill1: 2.2, skill2: 3.9, ultimate: 5.6 },
        'weapon_x02': { basicAttack: 1.0, skill1: 2.6, skill2: 4.3, ultimate: 6.1 },
        'deep_sea_diver': { basicAttack: 0.95, skill1: 2.4, skill2: 4.0, ultimate: 5.9 },
        'tidal_god': { basicAttack: 0.85, skill1: 2.1, skill2: 3.6, ultimate: 5.3 }
      };
      
      return multipliers[professionId] || { basicAttack: 1.0, skill1: 2.5, skill2: 4.0, ultimate: 6.0 };
    };
    
    const skillMultipliers = getSkillMultipliers(selectedProfession);
    
    const calculateDamageVariants = (multiplier) => {
      const baseDamage = baseAtk * multiplier;
      const criticalDamage = baseDamage * (1 + critDamage / 100);
      const weaknessDamageValue = baseDamage * (1 + weaknessDamage / 100);
      const criticalWeaknessDamage = criticalDamage * (1 + weaknessDamage / 100);
      
      return {
        normal: Math.floor(baseDamage),
        critical: Math.floor(criticalDamage),
        weakness: Math.floor(weaknessDamageValue),
        criticalWeakness: Math.floor(criticalWeaknessDamage)
      };
    };
    
    return {
      basicAttack: calculateDamageVariants(skillMultipliers.basicAttack),
      skill1: calculateDamageVariants(skillMultipliers.skill1),
      skill2: calculateDamageVariants(skillMultipliers.skill2),
      ultimate: calculateDamageVariants(skillMultipliers.ultimate)
    };
  };

  // 當配置改變時自動計算
  React.useEffect(() => {
    if (calcReady) {
      calculateTeamStats();
    }
  }, [calcReady, selectedCards, cardLevels, cardBreakthroughs, cardAdvancements, bondLevel, constellationMatch, perfectAlignment]);

  // 卡片選擇處理
  const handleCardSelect = (index, card) => {
    const newSelectedCards = [...selectedCards];
    newSelectedCards[index] = card;
    setSelectedCards(newSelectedCards);
  };

  // 職業改變時自動設定武器
  React.useEffect(() => {
    if (selectedProfession && weapons.length > 0) {
      setSelectedWeapon(weapons[0].id);
    }
  }, [selectedProfession, weapons]);

  if (!calcReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入戰鬥計算器...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 標題 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            ⚔️ 戰鬥傷害計算器 v2.0
          </h1>
          <p className="text-center text-gray-600">
            完整戰鬥傷害計算 | 職業技能倍率 | 即時傷害預覽
          </p>
        </div>

        {/* 選項卡 */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'config' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('config')}
            >
              📝 隊伍配置
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 屬性結果
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'damage' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('damage')}
            >
              💥 技能傷害
            </button>
          </div>

          {/* 配置選項卡 */}
          {activeTab === 'config' && (
            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 左側：基礎配置 */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      ⚔️ 戰鬥配置
                    </h3>
                    
                    {/* 搭檔選擇 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">👥 搭檔</label>
                      <select
                        value={selectedPartner}
                        onChange={(e) => {
                          setSelectedPartner(e.target.value);
                          setSelectedProfession('');
                          setSelectedWeapon('');
                          setSelectedCards(Array(6).fill(null));
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選擇搭檔</option>
                        {partners.map(partner => (
                          <option key={partner.id} value={partner.id}>{partner.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* 職業選擇 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">🎭 職業</label>
                      <select
                        value={selectedProfession}
                        onChange={(e) => setSelectedProfession(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!selectedPartner}
                      >
                        <option value="">選擇職業</option>
                        {professions.map(profession => (
                          <option key={profession.id} value={profession.id}>{profession.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* 武器顯示 */}
                    {selectedWeapon && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">🗡️ 武器</label>
                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          {weapons.find(w => w.id === selectedWeapon)?.name || '未選擇'}
                        </div>
                      </div>
                    )}

                    {/* 牽絆等級 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        💝 牽絆等級: <span className="text-blue-600 font-bold">{bondLevel}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="220"
                        value={bondLevel}
                        onChange={(e) => setBondLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>110</span>
                        <span>220</span>
                      </div>
                      {calcReady && (
                        <div className="text-xs text-green-600 mt-1">
                          {window.calc.calculateBond && (() => {
                            const bonus = window.calc.calculateBond(bondLevel);
                            return `加成: +${bonus.hp}HP +${bonus.atk}ATK +${bonus.def}DEF`;
                          })()}
                        </div>
                      )}
                    </div>

                    {/* 星譜匹配 */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ✨ 星譜匹配: <span className="text-purple-600 font-bold">{constellationMatch}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="6"
                        value={constellationMatch}
                        onChange={(e) => setConstellationMatch(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>3</span>
                        <span>6</span>
                      </div>
                    </div>

                    {/* 完美排列 */}
                    <div className="mb-4">
                      <label className="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={perfectAlignment}
                          onChange={(e) => setPerfectAlignment(e.target.checked)}
                          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">🎯 完美排列 (+100虛弱增傷)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 右側：卡片配置 */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      🃏 卡片配置
                    </h3>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Array.from({ length: 6 }, (_, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">卡片 {index + 1}</span>
                            <select
                              value={selectedCards[index]?.name || ''}
                              onChange={(e) => {
                                const card = availableCards.find(c => c.name === e.target.value);
                                handleCardSelect(index, card || null);
                              }}
                              className="text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!selectedPartner}
                            >
                              <option value="">選擇卡片</option>
                              {availableCards.map(card => (
                                <option key={card.id} value={card.name}>
                                  {card.name} ({card.category})
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {selectedCards[index] && (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">等級</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="80"
                                  value={cardLevels[index]}
                                  onChange={(e) => {
                                    const newLevels = [...cardLevels];
                                    newLevels[index] = parseInt(e.target.value) || 1;
                                    setCardLevels(newLevels);
                                  }}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">突破</label>
                                <select
                                  value={cardBreakthroughs[index]}
                                  onChange={(e) => {
                                    const newBreakthroughs = [...cardBreakthroughs];
                                    newBreakthroughs[index] = parseInt(e.target.value);
                                    setCardBreakthroughs(newBreakthroughs);
                                  }}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value={0}>0</option>
                                  <option value={1}>1</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">強化</label>
                                <select
                                  value={cardAdvancements[index]}
                                  onChange={(e) => {
                                    const newAdvancements = [...cardAdvancements];
                                    newAdvancements[index] = parseInt(e.target.value);
                                    setCardAdvancements(newAdvancements);
                                  }}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {[0, 1, 2, 3, 4, 5].map(level => (
                                    <option key={level} value={level}>{level}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 屬性結果選項卡 */}
          {activeTab === 'stats' && (
            <div className="p-6">
              {teamStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.hp.toLocaleString()}</div>
                    <div className="text-red-100">❤️ 生命值</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.atk.toLocaleString()}</div>
                    <div className="text-blue-100">⚔️ 攻擊力</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.def.toLocaleString()}</div>
                    <div className="text-green-100">🛡️ 防禦力</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.criticalRate.toFixed(1)}%</div>
                    <div className="text-purple-100">⚡ 暴擊率</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.criticalDamage.toFixed(1)}%</div>
                    <div className="text-orange-100">💥 暴擊傷害</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">{teamStats.weaknessDamage.toFixed(1)}%</div>
                    <div className="text-yellow-100">🎯 虛弱增傷</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl">請先配置隊伍以查看屬性結果</p>
                </div>
              )}
            </div>
          )}

          {/* 技能傷害選項卡 */}
          {activeTab === 'damage' && (
            <div className="p-6">
              {skillDamage ? (
                <div className="space-y-6">
                  {Object.entries(skillDamage).map(([skillName, damage]) => {
                    const skillInfo = {
                      basicAttack: { name: '普攻', icon: '👊', color: 'from-gray-400 to-gray-600' },
                      skill1: { name: '主動技(1技)', icon: '⚡', color: 'from-blue-400 to-blue-600' },
                      skill2: { name: '共鳴技(2技)', icon: '🌟', color: 'from-purple-400 to-purple-600' },
                      ultimate: { name: '誓約技(大招)', icon: '💫', color: 'from-pink-400 to-pink-600' }
                    };
                    
                    const info = skillInfo[skillName] || { name: skillName, icon: '⚔️', color: 'from-gray-400 to-gray-600' };
                    
                    return (
                      <div key={skillName} className={`bg-gradient-to-r ${info.color} rounded-lg p-6 text-white shadow-lg`}>
                        <h4 className="text-xl font-bold mb-4 flex items-center">
                          <span className="text-2xl mr-3">{info.icon}</span>
                          {info.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold mb-1">{damage.normal.toLocaleString()}</div>
                            <div className="text-sm opacity-90">一般傷害</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold mb-1 text-red-200">{damage.critical.toLocaleString()}</div>
                            <div className="text-sm opacity-90">暴擊傷害</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold mb-1 text-purple-200">{damage.weakness.toLocaleString()}</div>
                            <div className="text-sm opacity-90">虛弱傷害</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
                            <div className="text-2xl font-bold mb-1 text-yellow-200">{damage.criticalWeakness.toLocaleString()}</div>
                            <div className="text-sm opacity-90">暴擊虛弱</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">💥</div>
                  <p className="text-xl">請先配置隊伍以查看技能傷害</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 渲染計算器
ReactDOM.render(<BattleDamageCalculator />, document.getElementById('root'));
