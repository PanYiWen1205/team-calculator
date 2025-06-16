// bonusCalculator.js - 加成效果計算器
class BonusCalculator {
    constructor() {
        this.initializeConstants();
    }

    // 初始化常數配置
    initializeConstants() {
        // 突破倍率配置
        this.breakthroughMultipliers = {
            level60: {
                attack: 1.1652,
                defense: 1.1652,
                life: 1.0404
            },
            level70: {
                attack: 1.0354,
                defense: 1.0,
                life: 1.0354
            },
            level80: {
                all: 1.0787
            }
        };

        // 屬性加成參數配置
        this.attributeBonusParams = {
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

        // 虛弱增傷門檻配置
        this.weaknessThresholds = {
            life: { threshold: 8000, increment: 400, bonus: 0.2 },
            attack: { threshold: 400, increment: 20, bonus: 0.2 },
            defense: { threshold: 200, increment: 10, bonus: 0.2 }
        };
    }

    // 計算突破倍率
    getBreakthroughMultiplier(cardType, level, isBreakthrough) {
        if (!isBreakthrough) return 1;
        
        let multiplier = 1;
        
        if (level >= 60 && level < 70) {
            // 60等突破
            multiplier *= this.breakthroughMultipliers.level60[cardType] || 1;
        } else if (level >= 70 && level < 80) {
            // 70等突破 (累積60等突破效果)
            multiplier *= this.breakthroughMultipliers.level60[cardType] || 1;
            multiplier *= this.breakthroughMultipliers.level70[cardType] || 1;
        } else if (level >= 80) {
            // 80等覺醒 (累積之前的突破效果)
            multiplier *= this.breakthroughMultipliers.level60[cardType] || 1;
            multiplier *= this.breakthroughMultipliers.level70[cardType] || 1;
            multiplier *= this.breakthroughMultipliers.level80.all;
        }
        
        return multiplier;
    }

    // 計算強化倍率
    getAdvancementMultiplier(advancement) {
        return 1 + 0.12 * advancement;
    }

    // 計算屬性加成（日卡暴傷，月卡暴擊率）
    calculateAttributeBonus(category, advancement, level, isBreakthrough) {
        const params = this.attributeBonusParams[category];
        if (!params) return 0;
        
        let base0 = params.base;
        
        // 步驟1: 計算基礎等級成長（1-60級）
        if (level > 10) {
            const effectiveLevel = Math.min(level, 60);
            base0 += Math.floor((effectiveLevel - 10) / 10) * params.increment;
        }
        
        // 步驟2: 應用突破加成（只有在突破狀態下才生效）
        if (isBreakthrough) {
            if (level >= 61) {
                base0 += params.breakthrough; // 60級突破
            }
            if (level >= 71) {
                base0 += params.breakthrough; // 70級突破
            }
            if (level >= 80) {
                base0 += params.awaken; // 80級覺醒
            }
        }
        
        // 步驟3: 應用階段遞增
        const finalBonus = base0 + (params.stageIncrement * advancement);
        
        return finalBonus;
    }

    // 計算虛弱增傷
    calculateWeaknessDamage(cardType, statValue) {
        const config = this.weaknessThresholds[cardType];
        if (!config || statValue <= config.threshold) return 0;
        
        return Math.floor((statValue - config.threshold) / config.increment) * config.bonus;
    }

    // 計算搭檔牽絆加成
    calculatePartnerBondBonus(bondLevel) {
        if (bondLevel < 5) return { hp: 0, atk: 0, def: 0 };
        
        const bonusCount = Math.floor((bondLevel - 5) / 5) + 1;
        return { 
            hp: bonusCount * 200, 
            atk: bonusCount * 10, 
            def: bonusCount * 5 
        };
    }

    // 計算星譜匹配加成
    calculateConstellationBonus(matchCount, stats, attributes) {
        const matchBonus = matchCount * 2;
        
        // 屬性值加成
        const bonusMultiplier = 1 + matchBonus / 100;
        const bonusedStats = {
            hp: Math.floor(stats.hp * bonusMultiplier),
            atk: Math.floor(stats.atk * bonusMultiplier),
            def: Math.floor(stats.def * bonusMultiplier)
        };
        
        // 屬性加成
        const bonusedAttributes = {
            criticalRate: attributes.criticalRate + matchBonus * 0.5,
            criticalDamage: attributes.criticalDamage + matchBonus
        };
        
        return {
            stats: bonusedStats,
            attributes: bonusedAttributes,
            matchBonus
        };
    }

    // 應用完美排列加成
    applyPerfectAlignmentBonus(weaknessDamage, hasPerfectAlignment) {
        return hasPerfectAlignment ? weaknessDamage + 100 : weaknessDamage;
    }

    // 綜合計算所有加成效果
    calculateAllBonuses(config) {
        const {
            cardType,
            category,
            level,
            advancement,
            isBreakthrough,
            baseStats,
            bondLevel = 25,
            constellationMatch = 0,
            hasPerfectAlignment = false
        } = config;

        // 1. 突破倍率
        const breakthroughMultiplier = this.getBreakthroughMultiplier(cardType, level, isBreakthrough);
        
        // 2. 強化倍率
        const advancementMultiplier = this.getAdvancementMultiplier(advancement);
        
        // 3. 應用倍率到基礎屬性
        let stats = {
            hp: Math.floor(baseStats.hp * breakthroughMultiplier * advancementMultiplier),
            atk: Math.floor(baseStats.atk * breakthroughMultiplier * advancementMultiplier),
            def: Math.floor(baseStats.def * breakthroughMultiplier * advancementMultiplier)
        };
        
        // 4. 屬性加成計算
        let attributes = {
            criticalDamage: 0,
            criticalRate: 0
        };
        
        if (category === '日卡') {
            attributes.criticalDamage = this.calculateAttributeBonus(category, advancement, level, isBreakthrough);
        } else if (category === '月卡') {
            attributes.criticalRate = this.calculateAttributeBonus(category, advancement, level, isBreakthrough);
        }
        
        // 5. 星譜匹配加成
        const constellationBonus = this.calculateConstellationBonus(constellationMatch, stats, attributes);
        stats = constellationBonus.stats;
        attributes = constellationBonus.attributes;
        
        // 6. 虛弱增傷計算
        let weaknessDamage = this.calculateWeaknessDamage(cardType, stats[cardType === 'life' ? 'hp' : cardType === 'attack' ? 'atk' : 'def']);
        weaknessDamage = this.applyPerfectAlignmentBonus(weaknessDamage, hasPerfectAlignment);
        
        // 7. 搭檔牽絆加成
        const bondBonus = this.calculatePartnerBondBonus(bondLevel);
        
        return {
            stats,
            attributes,
            weaknessDamage,
            bondBonus,
            multipliers: {
                breakthrough: breakthroughMultiplier,
                advancement: advancementMultiplier
            }
        };
    }
}

// 創建全域實例
const bonusCalculator = new BonusCalculator();

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BonusCalculator, bonusCalculator };
}

if (typeof window !== 'undefined') {
    window.BonusCalculator = BonusCalculator;
    window.bonusCalculator = bonusCalculator;
}
