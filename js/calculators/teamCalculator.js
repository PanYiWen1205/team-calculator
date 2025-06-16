// teamCalculator.js - 隊伍計算器
class TeamCalculator {
    constructor() {
        // 依賴注入 - 在實際使用時會注入其他計算器
        this.baseStatsCalculator = null;
        this.bonusCalculator = null;
        this.cardDatabase = null;
        this.cardFilters = null;
    }

    // 設置依賴
    setDependencies(dependencies) {
        this.baseStatsCalculator = dependencies.baseStatsCalculator;
        this.bonusCalculator = dependencies.bonusCalculator;
        this.cardDatabase = dependencies.cardDatabase;
        this.cardFilters = dependencies.cardFilters;
    }

    // 計算單張卡片的完整屬性
    calculateSingleCardStats(config) {
        const {
            card,
            level = 80,
            breakthrough = 1,
            advancement = 3,
            userConstellationMatch = 0,
            userPerfectAlignment = false
        } = config;

        if (!card) {
            return { 
                hp: 0, atk: 0, def: 0, 
                criticalDamage: 0, criticalRate: 0, 
                weaknessDamage: 0 
            };
        }

        // 1. 計算基礎屬性
        const baseStats = this.baseStatsCalculator.calculateBaseStats(card.type, level);

        // 2. 計算所有加成效果
        const bonusResult = this.bonusCalculator.calculateAllBonuses({
            cardType: card.type,
            category: card.category,
            level,
            advancement,
            isBreakthrough: breakthrough > 0,
            baseStats,
            constellationMatch: userConstellationMatch,
            hasPerfectAlignment: userPerfectAlignment
        });

        return {
            hp: bonusResult.stats.hp,
            atk: bonusResult.stats.atk,
            def: bonusResult.stats.def,
            criticalDamage: bonusResult.attributes.criticalDamage,
            criticalRate: bonusResult.attributes.criticalRate,
            weaknessDamage: bonusResult.weaknessDamage
        };
    }

    // 計算隊伍總屬性
    calculateTeamStats(teamConfig) {
        const {
            cards,           // 卡片數組
            levels,          // 等級配置
            breakthroughs,   // 突破狀態
            advancements,    // 強化階段
            partnerBondLevel = 25,
            userConstellationMatch = 0,
            userPerfectAlignment = false
        } = teamConfig;

        // 驗證輸入
        if (!cards || !Array.isArray(cards)) {
            throw new Error('cards 必須是一個數組');
        }

        let totalStats = {
            hp: 0, atk: 0, def: 0,
            criticalDamage: 0, criticalRate: 0, weaknessDamage: 0
        };

        // 計算每張卡片的屬性並累加
        cards.forEach((card, index) => {
            if (!card) return;
            
            const cardStats = this.calculateSingleCardStats({
                card,
                level: levels[index] || 80,
                breakthrough: breakthroughs[index] || 1,
                advancement: advancements[index] || 3,
                userConstellationMatch,
                userPerfectAlignment
            });
            
            totalStats.hp += cardStats.hp;
            totalStats.atk += cardStats.atk;
            totalStats.def += cardStats.def;
            totalStats.criticalDamage += cardStats.criticalDamage;
            totalStats.criticalRate += cardStats.criticalRate;
            totalStats.weaknessDamage += cardStats.weaknessDamage;
        });

        // 加上搭檔牽絆值加成
        const bondBonus = this.bonusCalculator.calculatePartnerBondBonus(partnerBondLevel);
        totalStats.hp += bondBonus.hp;
        totalStats.atk += bondBonus.atk;
        totalStats.def += bondBonus.def;

        return totalStats;
    }

    // 比較不同配置下的隊伍屬性
    compareTeamConfigurations(configs) {
        const results = [];
        
        configs.forEach((config, index) => {
            const stats = this.calculateTeamStats(config);
            results.push({
                configIndex: index,
                configName: config.name || `配置 ${index + 1}`,
                stats,
                totalPower: this.calculateTotalPower(stats)
            });
        });

        // 按總戰力排序
        results.sort((a, b) => b.totalPower - a.totalPower);
        
        return results;
    }

    // 計算總戰力（簡單的綜合評分）
    calculateTotalPower(stats) {
        // 這是一個簡化的戰力計算公式，可以根據遊戲實際情況調整權重
        return Math.floor(
            stats.hp * 0.5 + 
            stats.atk * 3 + 
            stats.def * 2 + 
            stats.criticalDamage * 10 + 
            stats.criticalRate * 15 + 
            stats.weaknessDamage * 20
        );
    }

    // 優化隊伍配置建議
    optimizeTeamConfiguration(baseConfig, optimizationTarget = 'totalPower') {
        const suggestions = [];
        
        // 建議1: 等級優化
        const levelOptimization = this.suggestLevelOptimization(baseConfig);
        if (levelOptimization) {
            suggestions.push(levelOptimization);
        }
        
        // 建議2: 強化階段優化
        const advancementOptimization = this.suggestAdvancementOptimization(baseConfig);
        if (advancementOptimization) {
            suggestions.push(advancementOptimization);
        }
        
        // 建議3: 星譜匹配優化
        const constellationOptimization = this.suggestConstellationOptimization(baseConfig);
        if (constellationOptimization) {
            suggestions.push(constellationOptimization);
        }
        
        return {
            currentStats: this.calculateTeamStats(baseConfig),
            suggestions,
            bestConfiguration: this.findBestConfiguration(baseConfig, suggestions)
        };
    }

    // 建議等級優化
    suggestLevelOptimization(config) {
        // 找出等級最低的卡片
        const minLevel = Math.min(...config.levels);
        if (minLevel < 80) {
            return {
                type: 'level',
                description: `建議將所有卡片升級到80級，當前最低等級: ${minLevel}`,
                priority: 'high',
                expectedImprovement: '大幅提升基礎屬性'
            };
        }
        return null;
    }

    // 建議強化階段優化
    suggestAdvancementOptimization(config) {
        const minAdvancement = Math.min(...config.advancements);
        if (minAdvancement < 3) {
            return {
                type: 'advancement',
                description: `建議將所有卡片強化到3階，當前最低階段: ${minAdvancement}`,
                priority: 'medium',
                expectedImprovement: '提升12%基礎屬性'
            };
        }
        return null;
    }

    // 建議星譜匹配優化
    suggestConstellationOptimization(config) {
        if (config.userConstellationMatch < 2) {
            return {
                type: 'constellation',
                description: '建議提升星譜匹配度，可顯著提升所有屬性',
                priority: 'high',
                expectedImprovement: '每次匹配增加2%屬性值'
            };
        }
        return null;
    }

    // 找出最佳配置
    findBestConfiguration(baseConfig, suggestions) {
        // 應用所有建議創建最佳配置
        const optimizedConfig = { ...baseConfig };
        
        // 應用等級建議
        optimizedConfig.levels = optimizedConfig.levels.map(() => 80);
        
        // 應用強化建議
        optimizedConfig.advancements = optimizedConfig.advancements.map(() => 3);
        
        // 應用星譜建議
        optimizedConfig.userConstellationMatch = Math.max(optimizedConfig.userConstellationMatch, 2);
        
        return {
            config: optimizedConfig,
            stats: this.calculateTeamStats(optimizedConfig)
        };
    }

    // 批量計算示例
    batchCalculateByPartner(partnerId, level = 80, advancement = 3) {
        if (!this.cardFilters) {
            throw new Error('CardFilters dependency not set');
        }
        
        const partnerCards = this.cardFilters.getCardsByPartner(partnerId);
        const results = [];

        partnerCards.forEach(card => {
            const stats = this.calculateSingleCardStats({
                card,
                level,
                advancement,
                breakthrough: 1
            });
            
            results.push({
                name: card.name,
                category: card.category,
                type: this.cardDatabase.getCardTypes()[card.type],
                constellation: this.cardDatabase.getConstellations()[card.constellation],
                stats
            });
        });

        return results;
    }

    // 驗證計算準確性
    validateCalculations() {
        console.log('=== 驗證隊伍計算器準確性 ===');
        
        // 測試基礎屬性計算
        const testCard = this.cardDatabase.getCardByName('擁雪見緣');
        if (testCard) {
            const stats = this.calculateSingleCardStats({
                card: testCard,
                level: 80,
                breakthrough: 1,
                advancement: 3
            });
            console.log('擁雪見緣 80級3階屬性:', stats);
        }
        
        // 測試隊伍計算
        const testTeam = {
            cards: [
                this.cardDatabase.getCardByName('擁雪見緣'),
                this.cardDatabase.getCardByName('永恆封塵')
            ].filter(Boolean),
            levels: [80, 80],
            breakthroughs: [1, 1],
            advancements: [3, 3],
            partnerBondLevel: 25
        };
        
        if (testTeam.cards.length > 0) {
            const teamStats = this.calculateTeamStats(testTeam);
            console.log('測試隊伍總屬性:', teamStats);
        }
        
        return true;
    }
}

// 創建全域實例
const teamCalculator = new TeamCalculator();

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamCalculator, teamCalculator };
}

if (typeof window !== 'undefined') {
    window.TeamCalculator = TeamCalculator;
    window.teamCalculator = teamCalculator;
}
