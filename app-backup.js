// app-original.js - 原始單一文件版本 (v1.0)
// 此文件已被重構為模塊化架構，保留作為備份
// 新的模塊化文件位於 js/ 目錄下

// 戰鬥隊伍組建計算機 - 純JavaScript版本
// 完全基于数学公式的卡牌数值计算系统

class TeamCalculator {
    constructor() {
        this.initializeData();
    }

    // 初始化基础数据
    initializeData() {
        // 卡牌数据库
        this.cardDatabase = [
            { id: '001', name: '永恆封塵', category: '日卡', rarity: 5, constellation: 'blue', type: 'defense', partner: 'lishen' },
            { id: '002', name: '永恆心役', category: '日卡', rarity: 5, constellation: 'blue', type: 'defense', partner: 'lishen' },
            { id: '003', name: '擁雪見緣', category: '日卡', rarity: 5, constellation: 'red', type: 'attack', partner: 'lishen' },
            { id: '004', name: '擁雪未眠', category: '日卡', rarity: 5, constellation: 'red', type: 'attack', partner: 'lishen' },
            { id: '005', name: '失序', category: '月卡', rarity: 5, constellation: 'blue', type: 'defense', partner: 'lishen' },
            { id: '006', name: '抵此心上', category: '月卡', rarity: 5, constellation: 'pink', type: 'attack', partner: 'lishen' },
            { id: '007', name: '脈脈傾言', category: '月卡', rarity: 5, constellation: 'purple', type: 'attack', partner: 'lishen' },
            { id: '008', name: '餘溫過午', category: '月卡', rarity: 5, constellation: 'red', type: 'attack', partner: 'lishen' },
            { id: '009', name: '枕月眠', category: '月卡', rarity: 5, constellation: 'yellow', type: 'life', partner: 'lishen' },
            { id: '010', name: '沉湧過雲', category: '月卡', rarity: 5, constellation: 'blue', type: 'attack', partner: 'lishen' },
            { id: '011', name: '掠心相授', category: '日卡', rarity: 5, constellation: 'pink', type: 'attack', partner: 'qinche' },
            { id: '012', name: '掠心奪味', category: '日卡', rarity: 5, constellation: 'pink', type: 'attack', partner: 'qinche' },
            { id: '013', name: '深淵霞暈', category: '日卡', rarity: 5, constellation: 'green', type: 'life', partner: 'qinche' },
            { id: '014', name: '深淵秘印', category: '日卡', rarity: 5, constellation: 'green', type: 'life', partner: 'qinche' },
            { id: '015', name: '逐光破影', category: '日卡', rarity: 5, constellation: 'green', type: 'attack', partner: 'shenxinghui' },
            { id: '016', name: '逐光迷心', category: '日卡', rarity: 5, constellation: 'green', type: 'attack', partner: 'shenxinghui' },
            { id: '017', name: '末夜心聲', category: '日卡', rarity: 5, constellation: 'yellow', type: 'defense', partner: 'shenxinghui' },
            { id: '018', name: '末夜雨意', category: '日卡', rarity: 5, constellation: 'yellow', type: 'defense', partner: 'shenxinghui' },
            { id: '019', name: '遠空迷航', category: '日卡', rarity: 5, constellation: 'red', type: 'defense', partner: 'xiayizhou' },
            { id: '020', name: '遠空棠雨', category: '日卡', rarity: 5, constellation: 'red', type: 'defense', partner: 'xiayizhou' },
            { id: '021', name: '寂路同赴', category: '日卡', rarity: 5, constellation: 'purple', type: 'attack', partner: 'xiayizhou' },
            { id: '022', name: '寂路不歸', category: '日卡', rarity: 5, constellation: 'purple', type: 'attack', partner: 'xiayizhou' },
            { id: '023', name: '深海成諾', category: '日卡', rarity: 5, constellation: 'purple', type: 'attack', partner: 'qiyu' },
            { id: '024', name: '深海淬金', category: '日卡', rarity: 5, constellation: 'purple', type: 'attack', partner: 'qiyu' },
            { id: '025', name: '神殿日落', category: '日卡', rarity: 5, constellation: 'pink', type: 'life', partner: 'qiyu' },
            { id: '026', name: '神殿秘約', category: '日卡', rarity: 5, constellation: 'pink', type: 'life', partner: 'qiyu' }
        ];

        // 搭档数据
        this.partners = [
            { id: 'lishen', name: '黎深' },
            { id: 'shenxinghui', name: '沈星回' },
            { id: 'qiyu', name: '祁煜' },
            { id: 'qinche', name: '秦徹' },
            { id: 'xiayizhou', name: '夏以晝' }
        ];

        // 星谱对照
        this.constellations = {
            blue: '藍弧', green: '綠珥', purple: '紫輝', 
            yellow: '黃璃', red: '紅漪', pink: '粉珀'
        };

        // 卡片类型对照
        this.cardTypes = { 
            attack: '攻擊', defense: '防禦', life: '生命' 
        };
    }

    // 卡牌基础属性计算公式
    calculateBaseStats(cardType, level) {
        let hp, atk, def;
        
        if (cardType === 'attack') {
            if (level <= 10) {
                // 1-10级：HP+1080, ATK+59, DEF+27
                hp = 2400 + (level - 1) * (1080 / 9);
                atk = 132 + (level - 1) * (59 / 9);
                def = 60 + (level - 1) * (27 / 9);
            } else {
                // 10级基础值
                hp = 2400 + 1080;
                atk = 132 + 59;
                def = 60 + 27;
                
                // 10级后每级增长：每10级 HP+1680, ATK+92, DEF+42
                hp += (level - 10) * (1680 / 10);
                atk += (level - 10) * (92 / 10);
                def += (level - 10) * (42 / 10);
            }
        } else if (cardType === 'defense') {
            if (level <= 10) {
                // 1-10级：HP+1080, ATK+54, DEF+29
                hp = 2400 + (level - 1) * (1080 / 9);
                atk = 120 + (level - 1) * (54 / 9);
                def = 66 + (level - 1) * (29 / 9);
            } else {
                // 10级基础值
                hp = 2400 + 1080;
                atk = 120 + 54;
                def = 66 + 29;
                
                // 10级后每级增长：每10级 HP+1680, ATK+84, DEF+46
                hp += (level - 10) * (1680 / 10);
                atk += (level - 10) * (84 / 10);
                def += (level - 10) * (46 / 10);
            }
        } else if (cardType === 'life') {
            if (level <= 10) {
                // 1-10级：HP+1188, ATK+54, DEF+27
                hp = 2640 + (level - 1) * (1188 / 9);
                atk = 120 + (level - 1) * (54 / 9);
                def = 60 + (level - 1) * (27 / 9);
            } else {
                // 10级基础值
                hp = 2640 + 1188;
                atk = 120 + 54;
                def = 60 + 27;
                
                // 10级后每级增长：每10级 HP+1848, ATK+84, DEF+42
                hp += (level - 10) * (1848 / 10);
                atk += (level - 10) * (84 / 10);
                def += (level - 10) * (42 / 10);
            }
        }
        
        return {
            hp: Math.floor(hp),
            atk: Math.floor(atk),
            def: Math.floor(def)
        };
    }

    // 突破倍率计算
    getBreakthroughMultiplier(cardType, level, isBreakthrough) {
        if (!isBreakthrough) return 1;
        
        if (level >= 60 && level < 70) {
            // 60等突破
            if (cardType === 'attack' || cardType === 'defense') {
                return 1.1652;
            } else if (cardType === 'life') {
                return 1.0404;
            }
        } else if (level >= 70 && level < 80) {
            // 70等突破 (累积60等突破效果)
            let multiplier = 1;
            if (cardType === 'attack' || cardType === 'defense') {
                multiplier *= 1.1652; // 60等突破
            } else if (cardType === 'life') {
                multiplier *= 1.0404; // 60等突破
            }
            
            if (cardType === 'attack' || cardType === 'life') {
                multiplier *= 1.0354; // 70等突破
            }
            return multiplier;
        } else if (level >= 80) {
            // 80等觉醒 (累积之前的突破效果)
            let multiplier = 1;
            if (cardType === 'attack' || cardType === 'defense') {
                multiplier *= 1.1652; // 60等突破
            } else if (cardType === 'life') {
                multiplier *= 1.0404; // 60等突破
            }
            
            if (cardType === 'attack' || cardType === 'life') {
                multiplier *= 1.0354; // 70等突破
            }
            
            multiplier *= 1.0787; // 80等觉醒
            return multiplier;
        }
        
        return 1;
    }

    // 强化倍率计算
    getAdvancementMultiplier(advancement) {
        return 1 + 0.12 * advancement;
    }

    // 属性加成计算（日卡暴伤，月卡暴击率）
    calculateAttributeBonus(category, advancement, level, isBreakthrough) {
        // 基础参数配置
        const params = {
            '日卡': { 
                base: 5.2, 
                increment: 0.6, 
                breakthrough: 0.6, 
                awaken: 1.6,
                stageIncrement: 3.0 
            },
            '月卡': { 
                base: 2.6, 
                increment: 0.3, 
                breakthrough: 0.3, 
                awaken: 0.8,
                stageIncrement: 1.5 
            }
        };
        
        const p = params[category];
        let base0 = p.base;
        
        // 步骤1: 计算基础等级成长（1-60级）
        if (level > 10) {
            const effectiveLevel = Math.min(level, 60); // 61级以上按60级计算基础值
            base0 += Math.floor((effectiveLevel - 10) / 10) * p.increment;
        }
        
        // 步骤2: 应用突破加成（只有在突破状态下才生效）
        if (isBreakthrough) {
            // 61-70级享受60级突破加成
            if (level >= 61) {
                base0 += p.breakthrough; // 60级突破 +0.6%/+0.3%
            }
            // 71-79级享受60级+70级突破加成
            if (level >= 71) {
                base0 += p.breakthrough; // 70级突破 +0.6%/+0.3%
            }
            // 80级享受觉醒加成
            if (level >= 80) {
                base0 += p.awaken; // 80级觉醒 +1.6%/+0.8%
            }
        }
        
        // 步骤3: 应用阶段递增（每阶段固定增长）
        const finalBonus = base0 + (p.stageIncrement * advancement);
        
        return finalBonus;
    }

    // 虚弱增伤计算
    calculateWeaknessDamage(card, hp, atk, def) {
        if (!card) return 0;
        
        let weaknessDamage = 0;
        
        switch (card.type) {
            case 'life':
                if (hp > 8000) {
                    weaknessDamage = Math.floor((hp - 8000) / 400) * 0.2;
                }
                break;
            case 'attack':
                if (atk > 400) {
                    weaknessDamage = Math.floor((atk - 400) / 20) * 0.2;
                }
                break;
            case 'defense':
                if (def > 200) {
                    weaknessDamage = Math.floor((def - 200) / 10) * 0.2;
                }
                break;
        }
        
        return weaknessDamage;
    }

    // 搭档牵绊加成计算
    calculatePartnerBondBonus(bondLevel) {
        if (bondLevel < 5) return { hp: 0, atk: 0, def: 0 };
        const bonusCount = Math.floor((bondLevel - 5) / 5) + 1;
        return { hp: bonusCount * 200, atk: bonusCount * 10, def: bonusCount * 5 };
    }

    // 完整计算卡牌属性的函数
    calculateStats(card, level, breakthrough, advancement = 0, userConstellationMatch = 0, userPerfectAlignment = false) {
        if (!card) return { hp: 0, atk: 0, def: 0, criticalDamage: 0, criticalRate: 0, weaknessDamage: 0 };
        
        // 步骤1: 计算基础属性
        let baseStats = this.calculateBaseStats(card.type, level);
        
        // 步骤2: 应用突破倍率
        const breakthroughMultiplier = this.getBreakthroughMultiplier(card.type, level, breakthrough > 0);
        baseStats.hp = Math.floor(baseStats.hp * breakthroughMultiplier);
        baseStats.atk = Math.floor(baseStats.atk * breakthroughMultiplier);
        baseStats.def = Math.floor(baseStats.def * breakthroughMultiplier);
        
        // 步骤3: 应用强化倍率
        const advancementMultiplier = this.getAdvancementMultiplier(advancement);
        let hp = Math.floor(baseStats.hp * advancementMultiplier);
        let atk = Math.floor(baseStats.atk * advancementMultiplier);
        let def = Math.floor(baseStats.def * advancementMultiplier);
        
        // 计算属性加成
        let criticalDamage = 0;
        let criticalRate = 0;
        
        if (card.category === '日卡') {
            criticalDamage = this.calculateAttributeBonus(card.category, advancement, level, breakthrough > 0);
        } else if (card.category === '月卡') {
            criticalRate = this.calculateAttributeBonus(card.category, advancement, level, breakthrough > 0);
        }
        
        // 星谱加成
        const matchBonus = userConstellationMatch * 2;
        hp = Math.floor(hp * (1 + matchBonus / 100));
        atk = Math.floor(atk * (1 + matchBonus / 100));
        def = Math.floor(def * (1 + matchBonus / 100));
        criticalRate += matchBonus * 0.5;
        criticalDamage += matchBonus;
        
        // 虚弱增伤计算
        let weaknessDamage = this.calculateWeaknessDamage(card, hp, atk, def);
        if (userPerfectAlignment) {
            weaknessDamage += 100;
        }

        return { hp, atk, def, criticalDamage, criticalRate, weaknessDamage };
    }

    // 根据搭档筛选卡片
    getCardsByPartner(partnerId) {
        return this.cardDatabase.filter(card => card.partner === partnerId);
    }

    // 根据条件筛选卡片
    filterCards(partnerId, filters = {}) {
        const partnerCards = this.getCardsByPartner(partnerId);
        
        return partnerCards.filter(card => {
            // 种类筛选
            const categoryKey = card.category === '日卡' ? 'sun' : 'moon';
            if (filters.categories && !filters.categories[categoryKey]) return false;
            
            // 星谱筛选
            if (filters.constellations && !filters.constellations[card.constellation]) return false;
            
            // 类型筛选
            if (filters.types && !filters.types[card.type]) return false;
            
            return true;
        });
    }

    // 计算队伍总属性
    calculateTeamStats(teamConfig) {
        const {
            cards,           // 卡片数组
            levels,          // 等级配置
            breakthroughs,   // 突破状态
            advancements,    // 强化阶段
            partnerBondLevel = 25,
            userConstellationMatch = 0,
            userPerfectAlignment = false
        } = teamConfig;

        let totalStats = {
            hp: 0, atk: 0, def: 0,
            criticalDamage: 0, criticalRate: 0, weaknessDamage: 0
        };

        // 计算每张卡片的属性并累加
        cards.forEach((card, index) => {
            if (!card) return;
            
            const stats = this.calculateStats(
                card,
                levels[index] || 80,
                breakthroughs[index] || 1,
                advancements[index] || 3,
                userConstellationMatch,
                userPerfectAlignment
            );
            
            totalStats.hp += stats.hp;
            totalStats.atk += stats.atk;
            totalStats.def += stats.def;
            totalStats.criticalDamage += stats.criticalDamage;
            totalStats.criticalRate += stats.criticalRate;
            totalStats.weaknessDamage += stats.weaknessDamage;
        });

        // 加上搭档牵绊值加成
        const bondBonus = this.calculatePartnerBondBonus(partnerBondLevel);
        totalStats.hp += bondBonus.hp;
        totalStats.atk += bondBonus.atk;
        totalStats.def += bondBonus.def;

        return totalStats;
    }

    // 批量计算示例
    batchCalculateExample() {
        // 示例：计算所有黎深的卡片在80级3阶的数值
        const lishenCards = this.getCardsByPartner('lishen');
        const results = [];

        lishenCards.forEach(card => {
            const stats = this.calculateStats(card, 80, 1, 3, 0, false);
            results.push({
                name: card.name,
                category: card.category,
                type: this.cardTypes[card.type],
                constellation: this.constellations[card.constellation],
                stats: stats
            });
        });

        return results;
    }

    // 验证计算准确性
    validateCalculations() {
        console.log('=== 验证计算准确性 ===');
        
        // 测试基础属性计算
        const attackCard80 = this.calculateBaseStats('attack', 80);
        const defenseCard80 = this.calculateBaseStats('defense', 80);
        const lifeCard80 = this.calculateBaseStats('life', 80);
        
        console.log('80级基础属性：');
        console.log('攻击卡:', attackCard80);
        console.log('防御卡:', defenseCard80);
        console.log('生命卡:', lifeCard80);
        
        // 测试属性加成计算
        const sunCard80_3 = this.calculateAttributeBonus('日卡', 3, 80, true);
        const moonCard80_3 = this.calculateAttributeBonus('月卡', 3, 80, true);
        
        console.log('80级觉醒3阶属性加成：');
        console.log('日卡暴击伤害:', sunCard80_3.toFixed(1) + '%');
        console.log('月卡暴击率:', moonCard80_3.toFixed(1) + '%');
        console.log('比例关系:', (sunCard80_3 / moonCard80_3).toFixed(2) + ':1');
        
        return {
            baseStats: { attackCard80, defenseCard80, lifeCard80 },
            attributeBonus: { sunCard80_3, moonCard80_3 }
        };
    }
}

// 使用示例
const calculator = new TeamCalculator();

// 示例1: 计算单张卡片数值
const exampleCard = calculator.cardDatabase.find(card => card.name === '擁雪見緣');
const cardStats = calculator.calculateStats(exampleCard, 80, 1, 3, 2, true);
console.log('擁雪見緣 80级3阶数值:', cardStats);

// 示例2: 批量计算
const batchResults = calculator.batchCalculateExample();
console.log('黎深所有卡片80级3阶数值:', batchResults);

// 示例3: 验证计算准确性
const validation = calculator.validateCalculations();

// 示例4: 计算队伍总属性
const teamConfig = {
    cards: [
        calculator.cardDatabase.find(card => card.name === '擁雪見緣'),
        calculator.cardDatabase.find(card => card.name === '永恆封塵'),
        calculator.cardDatabase.find(card => card.name === '失序'),
        calculator.cardDatabase.find(card => card.name === '抵此心上'),
        calculator.cardDatabase.find(card => card.name === '脈脈傾言'),
        calculator.cardDatabase.find(card => card.name === '枕月眠')
    ],
    levels: [80, 80, 80, 80, 80, 80],
    breakthroughs: [1, 1, 1, 1, 1, 1],
    advancements: [3, 3, 3, 3, 3, 3],
    partnerBondLevel: 50,
    userConstellationMatch: 2,
    userPerfectAlignment: true
};

const teamStats = calculator.calculateTeamStats(teamConfig);
console.log('队伍总属性:', teamStats);

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamCalculator;
}
