// cardFilters.js - 卡片篩選工具
class CardFilters {
    constructor(cardDatabase) {
        this.cardDatabase = cardDatabase;
    }

    // 根據搭檔篩選卡片
    getCardsByPartner(partnerId) {
        return this.cardDatabase.getAllCards().filter(card => card.partner === partnerId);
    }

    // 根據類別篩選卡片
    getCardsByCategory(category) {
        return this.cardDatabase.getAllCards().filter(card => card.category === category);
    }

    // 根據星譜篩選卡片
    getCardsByConstellation(constellation) {
        return this.cardDatabase.getAllCards().filter(card => card.constellation === constellation);
    }

    // 根據類型篩選卡片
    getCardsByType(type) {
        return this.cardDatabase.getAllCards().filter(card => card.type === type);
    }

    // 根據稀有度篩選卡片
    getCardsByRarity(rarity) {
        return this.cardDatabase.getAllCards().filter(card => card.rarity === rarity);
    }

    // 多條件篩選卡片
    filterCards(partnerId, filters = {}) {
        let cards = partnerId ? this.getCardsByPartner(partnerId) : this.cardDatabase.getAllCards();
        
        // 種類篩選
        if (filters.categories) {
            cards = cards.filter(card => {
                const categoryKey = card.category === '日卡' ? 'sun' : 'moon';
                return filters.categories[categoryKey];
            });
        }
        
        // 星譜篩選
        if (filters.constellations) {
            cards = cards.filter(card => filters.constellations[card.constellation]);
        }
        
        // 類型篩選
        if (filters.types) {
            cards = cards.filter(card => filters.types[card.type]);
        }
        
        // 稀有度篩選
        if (filters.rarity) {
            cards = cards.filter(card => card.rarity === filters.rarity);
        }
        
        return cards;
    }

    // 搜尋卡片（根據名稱模糊搜尋）
    searchCards(searchTerm) {
        if (!searchTerm) return this.cardDatabase.getAllCards();
        
        const term = searchTerm.toLowerCase();
        return this.cardDatabase.getAllCards().filter(card => 
            card.name.toLowerCase().includes(term) ||
            card.id.toLowerCase().includes(term)
        );
    }

    // 按屬性排序卡片
    sortCards(cards, sortBy = 'name', order = 'asc') {
        const sortedCards = [...cards];
        
        sortedCards.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'rarity':
                    aValue = a.rarity;
                    bValue = b.rarity;
                    break;
                case 'category':
                    aValue = a.category;
                    bValue = b.category;
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'constellation':
                    aValue = a.constellation;
                    bValue = b.constellation;
                    break;
                case 'partner':
                    aValue = a.partner;
                    bValue = b.partner;
                    break;
                default:
                    aValue = a.name;
                    bValue = b.name;
            }
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });
        
        return sortedCards;
    }

    // 按搭檔分組卡片
    groupCardsByPartner(cards = null) {
        const cardsToGroup = cards || this.cardDatabase.getAllCards();
        const grouped = {};
        
        cardsToGroup.forEach(card => {
            if (!grouped[card.partner]) {
                grouped[card.partner] = [];
            }
            grouped[card.partner].push(card);
        });
        
        return grouped;
    }

    // 按類別分組卡片
    groupCardsByCategory(cards = null) {
        const cardsToGroup = cards || this.cardDatabase.getAllCards();
        const grouped = {};
        
        cardsToGroup.forEach(card => {
            if (!grouped[card.category]) {
                grouped[card.category] = [];
            }
            grouped[card.category].push(card);
        });
        
        return grouped;
    }

    // 按星譜分組卡片
    groupCardsByConstellation(cards = null) {
        const cardsToGroup = cards || this.cardDatabase.getAllCards();
        const grouped = {};
        
        cardsToGroup.forEach(card => {
            if (!grouped[card.constellation]) {
                grouped[card.constellation] = [];
            }
            grouped[card.constellation].push(card);
        });
        
        return grouped;
    }

    // 按類型分組卡片
    groupCardsByType(cards = null) {
        const cardsToGroup = cards || this.cardDatabase.getAllCards();
        const grouped = {};
        
        cardsToGroup.forEach(card => {
            if (!grouped[card.type]) {
                grouped[card.type] = [];
            }
            grouped[card.type].push(card);
        });
        
        return grouped;
    }

    // 獲取篩選統計資訊
    getFilterStatistics(cards = null) {
        const cardsToAnalyze = cards || this.cardDatabase.getAllCards();
        
        const stats = {
            total: cardsToAnalyze.length,
            byPartner: {},
            byCategory: {},
            byConstellation: {},
            byType: {},
            byRarity: {}
        };
        
        cardsToAnalyze.forEach(card => {
            // 按搭檔統計
            stats.byPartner[card.partner] = (stats.byPartner[card.partner] || 0) + 1;
            
            // 按類別統計
            stats.byCategory[card.category] = (stats.byCategory[card.category] || 0) + 1;
            
            // 按星譜統計
            stats.byConstellation[card.constellation] = (stats.byConstellation[card.constellation] || 0) + 1;
            
            // 按類型統計
            stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
            
            // 按稀有度統計
            stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1;
        });
        
        return stats;
    }

    // 高級搜尋功能
    advancedSearch(criteria) {
        let results = this.cardDatabase.getAllCards();
        
        // 文本搜尋
        if (criteria.searchTerm) {
            results = this.searchCards(criteria.searchTerm);
        }
        
        // 多條件篩選
        if (criteria.filters) {
            results = this.filterCards(criteria.partnerId, criteria.filters);
        }
        
        // 排序
        if (criteria.sortBy) {
            results = this.sortCards(results, criteria.sortBy, criteria.order);
        }
        
        // 分頁
        if (criteria.page && criteria.pageSize) {
            const startIndex = (criteria.page - 1) * criteria.pageSize;
            const endIndex = startIndex + criteria.pageSize;
            results = results.slice(startIndex, endIndex);
        }
        
        return results;
    }

    // 推薦卡片（基於現有隊伍配置）
    recommendCards(currentTeam, criteria = {}) {
        const { 
            maxRecommendations = 5,
            prioritizeBalance = true,
            excludeExisting = true 
        } = criteria;
        
        let availableCards = this.cardDatabase.getAllCards();
        
        // 排除已有卡片
        if (excludeExisting && currentTeam.length > 0) {
            const existingIds = currentTeam.map(card => card.id);
            availableCards = availableCards.filter(card => !existingIds.includes(card.id));
        }
        
        // 分析當前隊伍缺少的類型
        const teamAnalysis = this.analyzeTeamComposition(currentTeam);
        
        // 根據缺少的類型推薦卡片
        const recommendations = [];
        
        if (prioritizeBalance) {
            // 優先推薦缺少的類型
            Object.entries(teamAnalysis.missingTypes).forEach(([type, count]) => {
                const typeCards = availableCards.filter(card => card.type === type);
                recommendations.push(...typeCards.slice(0, count));
            });
        }
        
        // 如果推薦數量不足，添加其他高品質卡片
        if (recommendations.length < maxRecommendations) {
            const remainingSlots = maxRecommendations - recommendations.length;
            const otherCards = availableCards.filter(card => 
                !recommendations.some(rec => rec.id === card.id)
            );
            recommendations.push(...otherCards.slice(0, remainingSlots));
        }
        
        return recommendations.slice(0, maxRecommendations);
    }

    // 分析隊伍組成
    analyzeTeamComposition(team) {
        const composition = {
            totalCards: team.length,
            typeCount: {},
            categoryCount: {},
            constellationCount: {},
            partnerCount: {},
            missingTypes: {}
        };
        
        // 統計現有卡片
        team.forEach(card => {
            composition.typeCount[card.type] = (composition.typeCount[card.type] || 0) + 1;
            composition.categoryCount[card.category] = (composition.categoryCount[card.category] || 0) + 1;
            composition.constellationCount[card.constellation] = (composition.constellationCount[card.constellation] || 0) + 1;
            composition.partnerCount[card.partner] = (composition.partnerCount[card.partner] || 0) + 1;
        });
        
        // 分析缺少的類型（理想情況下每種類型應該有2張）
        const idealTypeCount = 2;
        ['attack', 'defense', 'life'].forEach(type => {
            const currentCount = composition.typeCount[type] || 0;
            if (currentCount < idealTypeCount) {
                composition.missingTypes[type] = idealTypeCount - currentCount;
            }
        });
        
        return composition;
    }
}

// 創建全域實例（需要在cardDatabase載入後初始化）
let cardFilters = null;

// 初始化函數
function initializeCardFilters(cardDatabase) {
    cardFilters = new CardFilters(cardDatabase);
    return cardFilters;
}

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CardFilters, initializeCardFilters };
}

if (typeof window !== 'undefined') {
    window.CardFilters = CardFilters;
    window.initializeCardFilters = initializeCardFilters;
}
