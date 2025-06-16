// partnerProfessionUtils.js - 搭檔職業工具
class PartnerProfessionUtils {
    constructor(cardDatabase) {
        this.cardDatabase = cardDatabase;
    }

    // 搭檔牽絆等級加成計算
    calculatePartnerBondBonus(bondLevel) {
        if (bondLevel < 5) return { hp: 0, atk: 0, def: 0 };
        const bonusCount = Math.floor((bondLevel - 5) / 5) + 1;
        return { 
            hp: bonusCount * 200, 
            atk: bonusCount * 10, 
            def: bonusCount * 5 
        };
    }

    // 搭檔職業同步函數
    syncPartnerProfessionWeapon(selectedProfession, callbacks = {}) {
        const profession = this.cardDatabase.getProfessionById(selectedProfession);
        if (profession) {
            const result = {
                partner: profession.partner,
                weapon: profession.weapon,
                cardType: profession.cardType
            };

            // 執行回調函數
            if (callbacks.setSelectedPartner) {
                callbacks.setSelectedPartner(result.partner);
            }
            if (callbacks.setSelectedWeapon) {
                callbacks.setSelectedWeapon(result.weapon);
            }
            if (callbacks.setSelectedCardType) {
                callbacks.setSelectedCardType(result.cardType);
            }

            return result;
        }
        return null;
    }

    // 牽絆等級驗證函數
    isValidBondLevel(level) {
        return level >= 1 && level <= 220;
    }

    // 獲取牽絆等級加成描述
    getBondBonusDescription(bondLevel) {
        if (bondLevel < 5) {
            return '等級5以上才有加成';
        }
        const bonus = this.calculatePartnerBondBonus(bondLevel);
        return `隊伍加成: +${bonus.hp}生命 +${bonus.atk}攻擊 +${bonus.def}防禦`;
    }

    // 獲取搭檔完整信息
    getPartnerFullInfo(partnerId) {
        const partner = this.cardDatabase.getPartnerById(partnerId);
        if (!partner) return null;

        const professions = this.cardDatabase.getProfessionsByPartner(partnerId);
        const cards = this.cardDatabase.getAllCards().filter(card => card.partner === partnerId);

        return {
            ...partner,
            professions,
            cards,
            totalCards: cards.length,
            professionCount: professions.length
        };
    }

    // 獲取職業完整信息
    getProfessionFullInfo(professionId) {
        const profession = this.cardDatabase.getProfessionById(professionId);
        if (!profession) return null;

        const partner = this.cardDatabase.getPartnerById(profession.partner);
        const weapon = this.cardDatabase.getWeaponById(profession.weapon);

        return {
            ...profession,
            partnerInfo: partner,
            weaponInfo: weapon
        };
    }

    // 根據條件篩選職業
    filterProfessions(filters = {}) {
        let professions = this.cardDatabase.getAllProfessions();

        // 按搭檔篩選
        if (filters.partnerId) {
            professions = professions.filter(p => p.partner === filters.partnerId);
        }

        // 按卡片類型篩選
        if (filters.cardType) {
            professions = professions.filter(p => p.cardType === filters.cardType);
        }

        // 按名稱搜尋
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            professions = professions.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.id.toLowerCase().includes(term)
            );
        }

        return professions;
    }

    // 獲取職業統計資訊
    getProfessionStatistics() {
        const professions = this.cardDatabase.getAllProfessions();
        const stats = {
            total: professions.length,
            byPartner: {},
            byCardType: {},
            byWeapon: {}
        };

        professions.forEach(profession => {
            // 按搭檔統計
            stats.byPartner[profession.partner] = (stats.byPartner[profession.partner] || 0) + 1;
            
            // 按卡片類型統計
            stats.byCardType[profession.cardType] = (stats.byCardType[profession.cardType] || 0) + 1;
            
            // 按武器統計
            stats.byWeapon[profession.weapon] = (stats.byWeapon[profession.weapon] || 0) + 1;
        });

        return stats;
    }

    // 推薦職業搭配
    recommendProfessionCombination(currentProfessions = [], maxRecommendations = 5) {
        const allProfessions = this.cardDatabase.getAllProfessions();
        const currentIds = currentProfessions.map(p => p.id);
        const available = allProfessions.filter(p => !currentIds.includes(p.id));

        // 分析當前配置
        const analysis = this.analyzeProfessionComposition(currentProfessions);
        const recommendations = [];

        // 推薦缺少的卡片類型
        if (analysis.missingTypes.length > 0) {
            analysis.missingTypes.forEach(type => {
                const typeProfs = available.filter(p => p.cardType === type);
                recommendations.push(...typeProfs.slice(0, 2)); // 每種類型推薦2個
            });
        }

        // 如果推薦數量不足，添加其他職業
        if (recommendations.length < maxRecommendations) {
            const remaining = maxRecommendations - recommendations.length;
            const others = available.filter(p => 
                !recommendations.some(rec => rec.id === p.id)
            );
            recommendations.push(...others.slice(0, remaining));
        }

        return recommendations.slice(0, maxRecommendations);
    }

    // 分析職業組成
    analyzeProfessionComposition(professions) {
        const analysis = {
            total: professions.length,
            typeCount: {},
            partnerCount: {},
            missingTypes: []
        };

        // 統計現有職業
        professions.forEach(profession => {
            analysis.typeCount[profession.cardType] = (analysis.typeCount[profession.cardType] || 0) + 1;
            analysis.partnerCount[profession.partner] = (analysis.partnerCount[profession.partner] || 0) + 1;
        });

        // 找出缺少的類型
        const allTypes = ['attack', 'defense', 'life'];
        allTypes.forEach(type => {
            if (!analysis.typeCount[type] || analysis.typeCount[type] < 2) {
                analysis.missingTypes.push(type);
            }
        });

        return analysis;
    }

    // 驗證職業配置
    validateProfessionConfiguration(professions) {
        const errors = [];
        const warnings = [];

        if (professions.length === 0) {
            errors.push('至少需要選擇一個職業');
            return { valid: false, errors, warnings };
        }

        // 檢查重複職業
        const professionIds = professions.map(p => p.id);
        const uniqueIds = [...new Set(professionIds)];
        if (professionIds.length !== uniqueIds.length) {
            errors.push('不能選擇重複的職業');
        }

        // 檢查職業平衡性
        const typeCount = {};
        professions.forEach(profession => {
            typeCount[profession.cardType] = (typeCount[profession.cardType] || 0) + 1;
        });

        const hasAttack = typeCount.attack > 0;
        const hasDefense = typeCount.defense > 0;
        const hasLife = typeCount.life > 0;

        if (!hasAttack) {
            warnings.push('建議至少包含一個攻擊型職業');
        }
        if (!hasDefense) {
            warnings.push('建議至少包含一個防禦型職業');
        }
        if (!hasLife) {
            warnings.push('建議至少包含一個生命型職業');
        }

        // 檢查搭檔分佈
        const partnerCount = {};
        professions.forEach(profession => {
            partnerCount[profession.partner] = (partnerCount[profession.partner] || 0) + 1;
        });

        const singlePartners = Object.values(partnerCount).filter(count => count === 1).length;
        if (singlePartners > 3) {
            warnings.push('建議集中培養少數搭檔以提高牽絆等級');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            analysis: {
                typeDistribution: typeCount,
                partnerDistribution: partnerCount,
                balance: { hasAttack, hasDefense, hasLife }
            }
        };
    }

    // 計算職業組合戰力評估
    calculateProfessionCombinationPower(professions, bondLevels = {}) {
        let totalPower = 0;
        const bonusMultipliers = {
            attack: 3,
            defense: 2,
            life: 2.5
        };

        professions.forEach(profession => {
            // 基礎職業戰力
            const basePower = 100;
            
            // 類型加成
            const typeMultiplier = bonusMultipliers[profession.cardType] || 1;
            
            // 牽絆等級加成
            const bondLevel = bondLevels[profession.partner] || 1;
            const bondMultiplier = 1 + (bondLevel - 1) * 0.02; // 每級2%加成
            
            const professionPower = basePower * typeMultiplier * bondMultiplier;
            totalPower += professionPower;
        });

        return Math.floor(totalPower);
    }

    // 生成職業配置報告
    generateProfessionReport(professions, bondLevels = {}) {
        const validation = this.validateProfessionConfiguration(professions);
        const statistics = this.analyzeProfessionComposition(professions);
        const power = this.calculateProfessionCombinationPower(professions, bondLevels);
        const recommendations = this.recommendProfessionCombination(professions);

        return {
            configuration: {
                professions: professions.map(p => ({
                    id: p.id,
                    name: p.name,
                    partner: p.partner,
                    cardType: p.cardType,
                    weapon: p.weapon
                })),
                totalCount: professions.length
            },
            validation,
            statistics,
            totalPower: power,
            recommendations: recommendations.map(p => ({
                id: p.id,
                name: p.name,
                reason: `補強${p.cardType}類型職業`
            })),
            bondLevelImpact: this.calculateBondLevelImpact(professions, bondLevels),
            generatedAt: new Date().toISOString()
        };
    }

    // 計算牽絆等級影響
    calculateBondLevelImpact(professions, bondLevels) {
        const impact = {};
        
        // 獲取涉及的搭檔
        const partners = [...new Set(professions.map(p => p.partner))];
        
        partners.forEach(partnerId => {
            const currentLevel = bondLevels[partnerId] || 1;
            const partnerProfessions = professions.filter(p => p.partner === partnerId);
            
            // 計算當前牽絆加成
            const currentBonus = this.calculatePartnerBondBonus(currentLevel);
            
            // 計算升級到下一個階段的加成
            const nextMilestone = Math.ceil(Math.max(currentLevel, 5) / 5) * 5 + 5;
            const nextBonus = this.calculatePartnerBondBonus(nextMilestone);
            
            impact[partnerId] = {
                currentLevel,
                currentBonus,
                nextMilestone,
                nextBonus,
                improvement: {
                    hp: nextBonus.hp - currentBonus.hp,
                    atk: nextBonus.atk - currentBonus.atk,
                    def: nextBonus.def - currentBonus.def
                },
                affectedProfessions: partnerProfessions.length
            };
        });
        
        return impact;
    }

    // 導出職業配置到JSON
    exportProfessionConfiguration(professions, bondLevels = {}) {
        return {
            version: '1.0',
            professions: professions.map(p => ({
                id: p.id,
                name: p.name
            })),
            bondLevels,
            exportTime: new Date().toISOString(),
            checksum: this.generateConfigChecksum(professions, bondLevels)
        };
    }

    // 從JSON導入職業配置
    importProfessionConfiguration(jsonConfig) {
        if (!jsonConfig.professions) {
            throw new Error('無效的配置文件：缺少職業數據');
        }

        const professions = [];
        jsonConfig.professions.forEach(profData => {
            const profession = this.cardDatabase.getProfessionById(profData.id);
            if (profession) {
                professions.push(profession);
            } else {
                console.warn(`未找到職業: ${profData.id}`);
            }
        });

        return {
            professions,
            bondLevels: jsonConfig.bondLevels || {},
            importTime: new Date().toISOString()
        };
    }

    // 生成配置校驗碼
    generateConfigChecksum(professions, bondLevels) {
        const data = {
            professionIds: professions.map(p => p.id).sort(),
            bondLevels: Object.keys(bondLevels).sort().reduce((obj, key) => {
                obj[key] = bondLevels[key];
                return obj;
            }, {})
        };
        
        // 簡單的校驗碼生成（實際應用中可使用更複雜的算法）
        return btoa(JSON.stringify(data)).slice(0, 16);
    }
}

// 創建全域實例（需要在cardDatabase載入後初始化）
let partnerProfessionUtils = null;

// 初始化函數
function initializePartnerProfessionUtils(cardDatabase) {
    partnerProfessionUtils = new PartnerProfessionUtils(cardDatabase);
    return partnerProfessionUtils;
}

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PartnerProfessionUtils, initializePartnerProfessionUtils };
}

if (typeof window !== 'undefined') {
    window.PartnerProfessionUtils = PartnerProfessionUtils;
    window.initializePartnerProfessionUtils = initializePartnerProfessionUtils;
}
