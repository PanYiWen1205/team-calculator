// baseStatsCalculator.js - 基礎屬性計算器
class BaseStatsCalculator {
    constructor() {
        this.initializeConstants();
    }

    // 初始化計算常數
    initializeConstants() {
        // 基礎屬性配置
        this.baseConfig = {
            attack: {
                baseHp: 2400,
                baseAtk: 132,
                baseDef: 60,
                level1to10: { hp: 1080, atk: 59, def: 27 },
                level10plus: { hp: 1680, atk: 92, def: 42 }
            },
            defense: {
                baseHp: 2400,
                baseAtk: 120,
                baseDef: 66,
                level1to10: { hp: 1080, atk: 54, def: 29 },
                level10plus: { hp: 1680, atk: 84, def: 46 }
            },
            life: {
                baseHp: 2640,
                baseAtk: 120,
                baseDef: 60,
                level1to10: { hp: 1188, atk: 54, def: 27 },
                level10plus: { hp: 1848, atk: 84, def: 42 }
            }
        };
    }

    // 計算基礎屬性
    calculateBaseStats(cardType, level) {
        const config = this.baseConfig[cardType];
        if (!config) {
            throw new Error(`未知的卡片類型: ${cardType}`);
        }

        let hp, atk, def;
        
        if (level <= 10) {
            // 1-10級的計算
            hp = config.baseHp + (level - 1) * (config.level1to10.hp / 9);
            atk = config.baseAtk + (level - 1) * (config.level1to10.atk / 9);
            def = config.baseDef + (level - 1) * (config.level1to10.def / 9);
        } else {
            // 10級基礎值
            hp = config.baseHp + config.level1to10.hp;
            atk = config.baseAtk + config.level1to10.atk;
            def = config.baseDef + config.level1to10.def;
            
            // 10級後每級增長
            hp += (level - 10) * (config.level10plus.hp / 10);
            atk += (level - 10) * (config.level10plus.atk / 10);
            def += (level - 10) * (config.level10plus.def / 10);
        }
        
        return {
            hp: Math.floor(hp),
            atk: Math.floor(atk),
            def: Math.floor(def)
        };
    }

    // 驗證計算結果
    validateBaseStats(cardType, level, expectedStats) {
        const calculated = this.calculateBaseStats(cardType, level);
        const isValid = 
            calculated.hp === expectedStats.hp &&
            calculated.atk === expectedStats.atk &&
            calculated.def === expectedStats.def;
        
        return {
            isValid,
            calculated,
            expected: expectedStats,
            differences: {
                hp: calculated.hp - expectedStats.hp,
                atk: calculated.atk - expectedStats.atk,
                def: calculated.def - expectedStats.def
            }
        };
    }

    // 獲取等級範圍內的所有屬性值
    getStatsProgression(cardType, startLevel = 1, endLevel = 80) {
        const progression = [];
        for (let level = startLevel; level <= endLevel; level++) {
            const stats = this.calculateBaseStats(cardType, level);
            progression.push({
                level,
                ...stats
            });
        }
        return progression;
    }

    // 計算屬性成長率
    calculateGrowthRate(cardType, fromLevel, toLevel) {
        const startStats = this.calculateBaseStats(cardType, fromLevel);
        const endStats = this.calculateBaseStats(cardType, toLevel);
        
        return {
            levelDiff: toLevel - fromLevel,
            hpGrowth: endStats.hp - startStats.hp,
            atkGrowth: endStats.atk - startStats.atk,
            defGrowth: endStats.def - startStats.def,
            hpGrowthRate: ((endStats.hp / startStats.hp - 1) * 100).toFixed(2) + '%',
            atkGrowthRate: ((endStats.atk / startStats.atk - 1) * 100).toFixed(2) + '%',
            defGrowthRate: ((endStats.def / startStats.def - 1) * 100).toFixed(2) + '%'
        };
    }
}

// 創建全域實例
const baseStatsCalculator = new BaseStatsCalculator();

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BaseStatsCalculator, baseStatsCalculator };
}

if (typeof window !== 'undefined') {
    window.BaseStatsCalculator = BaseStatsCalculator;
    window.baseStatsCalculator = baseStatsCalculator;
}
