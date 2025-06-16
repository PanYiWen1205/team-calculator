// coreSystem.js - 芯核系統
class CoreSystem {
    constructor() {
        this.initializeData();
    }

    // 初始化芯核數據
    initializeData() {
        // 芯核類型定義
        this.coreTypes = {
            alpha: {
                id: 'alpha',
                name: 'α芯核',
                shape: '菱形',
                symbol: '♦',
                fixedMainStat: 'hp_flat',
                allowedCardTypes: ['日卡'] // 日卡專用
            },
            beta: {
                id: 'beta',
                name: 'β芯核',
                shape: '方塊',
                symbol: '■',
                possibleMainStats: ['atk_percent', 'def_percent', 'hp_percent', 'energy_recovery', 'covenant_recovery', 'covenant_damage'],
                allowedCardTypes: ['日卡'] // 日卡專用
            },
            gamma: {
                id: 'gamma',
                name: 'γ芯核',
                shape: '海膽',
                symbol: '✱',
                fixedMainStat: 'atk_flat',
                allowedCardTypes: ['月卡'] // 月卡專用
            },
            delta: {
                id: 'delta',
                name: 'δ芯核',
                shape: '三角',
                symbol: '▲',
                possibleMainStats: ['atk_percent', 'def_percent', 'hp_percent', 'critical_rate', 'critical_damage', 'weakness_damage'],
                allowedCardTypes: ['月卡'] // 月卡專用
            }
        };

        // 屬性類型定義
        this.statTypes = {
            // 基礎數值（固定值，整數）
            hp_flat: { name: '生命值', type: 'flat', unit: '', valueType: 'integer' },
            atk_flat: { name: '攻擊值', type: 'flat', unit: '', valueType: 'integer' },
            def_flat: { name: '防禦值', type: 'flat', unit: '', valueType: 'integer' },
            // 百分比數值
            hp_percent: { name: '生命加成', type: 'percent', unit: '%', valueType: 'decimal' },
            atk_percent: { name: '攻擊加成', type: 'percent', unit: '%', valueType: 'decimal' },
            def_percent: { name: '防禦加成', type: 'percent', unit: '%', valueType: 'decimal' },
            // 戰鬥屬性（百分比）
            critical_rate: { name: '暴擊', type: 'percent', unit: '%', valueType: 'decimal' },
            critical_damage: { name: '暴傷', type: 'percent', unit: '%', valueType: 'decimal' },
            weakness_damage: { name: '虛弱增傷', type: 'percent', unit: '%', valueType: 'decimal' },
            // 特殊屬性（百分比）
            energy_recovery: { name: '加速回能', type: 'percent', unit: '%', valueType: 'decimal' },
            covenant_recovery: { name: '誓約回能', type: 'percent', unit: '%', valueType: 'decimal' },
            covenant_damage: { name: '誓約增傷', type: 'percent', unit: '%', valueType: 'decimal' }
        };

        // 副屬性池定義（所有芯核共用）
        this.subStatPool = [
            'hp_flat', 'atk_flat', 'def_flat',
            'hp_percent', 'atk_percent', 'def_percent',
            'critical_rate', 'critical_damage', 'weakness_damage',
            'covenant_damage'
        ];
    }

    // 獲取芯核類型
    getCoreTypes() {
        return this.coreTypes;
    }

    // 獲取屬性類型
    getStatTypes() {
        return this.statTypes;
    }

    // 獲取副屬性池
    getSubStatPool() {
        return this.subStatPool;
    }

    // 根據卡片類別獲取可用芯核
    getAvailableCoresByCardCategory(cardCategory) {
        const availableCores = {};
        
        Object.entries(this.coreTypes).forEach(([coreId, coreData]) => {
            if (coreData.allowedCardTypes.includes(cardCategory)) {
                availableCores[coreId] = coreData;
            }
        });
        
        return availableCores;
    }

    // 驗證芯核配置是否有效
    validateCoreConfiguration(coreType, cardCategory, mainStat) {
        const core = this.coreTypes[coreType];
        if (!core) return { valid: false, error: '未知的芯核類型' };
        
        // 檢查卡片類別是否匹配
        if (!core.allowedCardTypes.includes(cardCategory)) {
            return { 
                valid: false, 
                error: `${core.name}不能用於${cardCategory}` 
            };
        }
        
        // 檢查主詞條是否有效
        if (core.fixedMainStat) {
            if (mainStat && mainStat !== core.fixedMainStat) {
                return { 
                    valid: false, 
                    error: `${core.name}的主詞條固定為${this.statTypes[core.fixedMainStat].name}` 
                };
            }
        } else if (core.possibleMainStats && mainStat) {
            if (!core.possibleMainStats.includes(mainStat)) {
                return { 
                    valid: false, 
                    error: `${core.name}不支持${this.statTypes[mainStat].name}作為主詞條` 
                };
            }
        }
        
        return { valid: true };
    }

    // 應用芯核加成的輔助函數
    applyCoreBonus(bonus, statType, statValue, baseStats) {
        const value = parseFloat(statValue) || 0;
        
        switch (statType) {
            case 'hp_flat':
                bonus.hp += value;
                break;
            case 'hp_percent':
                bonus.hp += Math.floor(baseStats.hp * value / 100);
                break;
            case 'atk_flat':
                bonus.atk += value;
                break;
            case 'atk_percent':
                bonus.atk += Math.floor(baseStats.atk * value / 100);
                break;
            case 'def_flat':
                bonus.def += value;
                break;
            case 'def_percent':
                bonus.def += Math.floor(baseStats.def * value / 100);
                break;
            case 'critical_rate':
                bonus.criticalRate += value;
                break;
            case 'critical_damage':
                bonus.criticalDamage += value;
                break;
            case 'weakness_damage':
                bonus.weaknessDamage += value;
                break;
            case 'energy_recovery':
                bonus.energyRecovery += value;
                break;
            case 'covenant_recovery':
                bonus.covenantRecovery += value;
                break;
            case 'covenant_damage':
                bonus.covenantDamage += value;
                break;
        }
    }

    // 計算單個芯核的加成
    calculateSingleCoreBonus(coreType, coreConfig, baseStats) {
        let bonus = { 
            hp: 0, atk: 0, def: 0, 
            criticalRate: 0, criticalDamage: 0, weaknessDamage: 0, 
            energyRecovery: 0, covenantRecovery: 0, covenantDamage: 0 
        };

        if (!coreConfig) return bonus;

        const coreTypeData = this.coreTypes[coreType];
        if (!coreTypeData) return bonus;

        // 處理主詞條
        if (coreTypeData.fixedMainStat) {
            // 固定主詞條
            const mainValue = parseFloat(coreConfig.mainValue) || 0;
            this.applyCoreBonus(bonus, coreTypeData.fixedMainStat, mainValue, baseStats);
        } else if (coreConfig.mainStat && coreConfig.mainValue) {
            // 可選主詞條
            const mainValue = parseFloat(coreConfig.mainValue) || 0;
            this.applyCoreBonus(bonus, coreConfig.mainStat, mainValue, baseStats);
        }

        // 處理副詞條
        for (let i = 1; i <= 4; i++) {
            const statType = coreConfig[`sub${i}`];
            const statValue = parseFloat(coreConfig[`sub${i}Value`]) || 0;
            if (statType && statValue) {
                this.applyCoreBonus(bonus, statType, statValue, baseStats);
            }
        }

        return bonus;
    }

    // 計算卡片芯核總加成
    calculateCardCoreBonus(cardCores, baseStats, cardCategory) {
        let totalBonus = { 
            hp: 0, atk: 0, def: 0, 
            criticalRate: 0, criticalDamage: 0, weaknessDamage: 0, 
            energyRecovery: 0, covenantRecovery: 0, covenantDamage: 0 
        };

        if (!cardCores) return totalBonus;

        // 獲取該卡片類別可用的芯核類型
        const availableCores = this.getAvailableCoresByCardCategory(cardCategory);

        // 計算每種芯核類型的加成
        Object.keys(availableCores).forEach(coreType => {
            if (cardCores[coreType]) {
                const coreBonus = this.calculateSingleCoreBonus(coreType, cardCores[coreType], baseStats);
                
                // 累加到總加成
                Object.keys(coreBonus).forEach(stat => {
                    totalBonus[stat] += coreBonus[stat];
                });
            }
        });

        return totalBonus;
    }

    // 計算隊伍芯核總加成
    calculateTeamCoreBonus(teamCores, teamBaseStats, cardCategories) {
        let totalBonus = { 
            hp: 0, atk: 0, def: 0, 
            criticalRate: 0, criticalDamage: 0, weaknessDamage: 0, 
            energyRecovery: 0, covenantRecovery: 0, covenantDamage: 0 
        };

        if (!teamCores || !Array.isArray(teamCores)) return totalBonus;

        teamCores.forEach((cardCores, index) => {
            if (cardCores && teamBaseStats[index] && cardCategories[index]) {
                const cardBonus = this.calculateCardCoreBonus(
                    cardCores, 
                    teamBaseStats[index], 
                    cardCategories[index]
                );
                
                // 累加到隊伍總加成
                Object.keys(cardBonus).forEach(stat => {
                    totalBonus[stat] += cardBonus[stat];
                });
            }
        });

        return totalBonus;
    }

    // 更新芯核屬性的輔助函數
    updateCoreStats(cardCores, setCardCores, slotId, coreType, statType, value) {
        setCardCores(prev => ({
            ...prev,
            [slotId]: {
                ...prev[slotId],
                [coreType]: {
                    ...prev[slotId]?.[coreType],
                    [statType]: value
                }
            }
        }));
    }

    // 生成芯核配置模板
    generateCoreTemplate(coreType) {
        const coreData = this.coreTypes[coreType];
        if (!coreData) return null;

        const template = {
            coreType,
            coreName: coreData.name
        };

        // 如果有固定主詞條
        if (coreData.fixedMainStat) {
            template.mainStat = coreData.fixedMainStat;
            template.mainStatName = this.statTypes[coreData.fixedMainStat].name;
            template.mainValue = 0;
        } else {
            template.possibleMainStats = coreData.possibleMainStats;
            template.mainStat = '';
            template.mainValue = 0;
        }

        // 副詞條模板
        for (let i = 1; i <= 4; i++) {
            template[`sub${i}`] = '';
            template[`sub${i}Value`] = 0;
        }

        return template;
    }

    // 驗證芯核數值範圍
    validateStatValue(statType, value, isMainStat = false) {
        const stat = this.statTypes[statType];
        if (!stat) return { valid: false, error: '未知的屬性類型' };

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return { valid: false, error: '數值必須是有效數字' };

        // 基本範圍檢查（可以根據遊戲實際情況調整）
        if (stat.type === 'flat') {
            if (numValue < 0 || numValue > 10000) {
                return { valid: false, error: '固定數值超出合理範圍 (0-10000)' };
            }
        } else if (stat.type === 'percent') {
            if (numValue < 0 || numValue > 100) {
                return { valid: false, error: '百分比數值超出合理範圍 (0-100%)' };
            }
        }

        return { valid: true };
    }
}

// 創建全域實例
const coreSystem = new CoreSystem();

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CoreSystem, coreSystem };
}

if (typeof window !== 'undefined') {
    window.CoreSystem = CoreSystem;
    window.coreSystem = coreSystem;
}
