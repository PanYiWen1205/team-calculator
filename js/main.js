// main.js - 戰鬥隊伍組建計算機主程序 (修正版)
class TeamCalculatorApp {
    constructor() {
        this.initialized = false;
        this.dependencies = {};
        this.init();
    }

    // 初始化應用程序
    init() {
        try {
            // 1. 初始化數據層
            this.dependencies.cardDatabase = window.cardDatabase;
            
            // 2. 初始化計算器
            this.dependencies.baseStatsCalculator = window.baseStatsCalculator;
            this.dependencies.bonusCalculator = window.bonusCalculator;
            
            // 3. 初始化新系統
            this.dependencies.coreSystem = window.coreSystem;
            this.dependencies.partnerProfessionUtils = window.initializePartnerProfessionUtils(this.dependencies.cardDatabase);
            
            // 4. 初始化工具類
            this.dependencies.cardFilters = window.initializeCardFilters(this.dependencies.cardDatabase);
            
            // 5. 初始化主計算器
            this.dependencies.teamCalculator = window.teamCalculator;
            this.dependencies.teamCalculator.setDependencies(this.dependencies);
            
            this.initialized = true;
            console.log('✅ 戰鬥隊伍組建計算機初始化成功');
            console.log('🔧 新增功能：芯核系統、搭檔職業系統');
            
            // 運行示例
            this.runExamples();
            
        } catch (error) {
            console.error('❌ 初始化失敗:', error);
            this.initialized = false;
        }
    }

    // 檢查是否已初始化
    checkInitialized() {
        if (!this.initialized) {
            throw new Error('應用程序尚未初始化，請先調用 init() 方法');
        }
    }

    // ✅ 修正：使用正確的函數名稱
    calculateSingleCard(cardName, config = {}) {
        this.checkInitialized();
        
        const card = this.dependencies.cardDatabase.getCardByName(cardName);
        if (!card) {
            throw new Error(`找不到卡片: ${cardName}`);
        }
        
        const defaultConfig = {
            level: 80,
            breakthrough: 1,
            advancement: 3,
            userConstellationMatch: 0,
            userPerfectAlignment: false
        };
        
        const finalConfig = { ...defaultConfig, ...config, card };
        return this.dependencies.teamCalculator.calculateSingleCardStats(finalConfig);
    }

    // 計算帶芯核的單張卡片屬性
    calculateSingleCardWithCore(cardName, config = {}) {
        this.checkInitialized();
        
        const card = this.dependencies.cardDatabase.getCardByName(cardName);
        if (!card) {
            throw new Error(`找不到卡片: ${cardName}`);
        }
        
        const defaultConfig = {
            level: 80,
            breakthrough: 1,
            advancement: 3,
            userConstellationMatch: 0,
            userPerfectAlignment: false,
            coreConfiguration: null // 芯核配置
        };
        
        const finalConfig = { ...defaultConfig, ...config, card };
        
        // 計算基礎屬性
        const baseStats = this.dependencies.teamCalculator.calculateSingleCardStats(finalConfig);
        
        // 如果有芯核配置，計算芯核加成
        if (finalConfig.coreConfiguration) {
            const coreBonus = this.dependencies.coreSystem.calculateCardCoreBonus(
                finalConfig.coreConfiguration,
                baseStats,
                card.category
            );
            
            // 應用芯核加成
            return {
                hp: baseStats.hp + coreBonus.hp,
                atk: baseStats.atk + coreBonus.atk,
                def: baseStats.def + coreBonus.def,
                criticalRate: baseStats.criticalRate + coreBonus.criticalRate,
                criticalDamage: baseStats.criticalDamage + coreBonus.criticalDamage,
                weaknessDamage: baseStats.weaknessDamage + coreBonus.weaknessDamage,
                coreBonus // 額外返回芯核加成詳情
            };
        }
        
        return baseStats;
    }

    // 計算隊伍屬性
    calculateTeam(teamConfig) {
        this.checkInitialized();
        
        // 驗證和處理輸入
        const processedConfig = this.processTeamConfig(teamConfig);
        return this.dependencies.teamCalculator.calculateTeamStats(processedConfig);
    }

    // 計算帶芯核的隊伍屬性
    calculateTeamWithCore(teamConfig) {
        this.checkInitialized();
        
        // 處理隊伍配置
        const processedConfig = this.processTeamConfig(teamConfig);
        
        // 計算基礎隊伍屬性
        const baseTeamStats = this.dependencies.teamCalculator.calculateTeamStats(processedConfig);
        
        // 如果有芯核配置，計算芯核加成
        if (teamConfig.coreConfigurations && Array.isArray(teamConfig.coreConfigurations)) {
            const teamBaseStats = processedConfig.cards.map((card, index) => {
                if (!card) return null;
                return this.dependencies.teamCalculator.calculateSingleCardStats({
                    card,
                    level: processedConfig.levels[index],
                    breakthrough: processedConfig.breakthroughs[index],
                    advancement: processedConfig.advancements[index],
                    userConstellationMatch: processedConfig.userConstellationMatch,
                    userPerfectAlignment: processedConfig.userPerfectAlignment
                });
            });
            
            const cardCategories = processedConfig.cards.map(card => card?.category);
            
            const totalCoreBonus = this.dependencies.coreSystem.calculateTeamCoreBonus(
                teamConfig.coreConfigurations,
                teamBaseStats,
                cardCategories
            );
            
            // 應用芯核加成到隊伍總屬性
            return {
                hp: baseTeamStats.hp + totalCoreBonus.hp,
                atk: baseTeamStats.atk + totalCoreBonus.atk,
                def: baseTeamStats.def + totalCoreBonus.def,
                criticalRate: baseTeamStats.criticalRate + totalCoreBonus.criticalRate,
                criticalDamage: baseTeamStats.criticalDamage + totalCoreBonus.criticalDamage,
                weaknessDamage: baseTeamStats.weaknessDamage + totalCoreBonus.weaknessDamage,
                coreBonus: totalCoreBonus // 額外返回芯核加成詳情
            };
        }
        
        return baseTeamStats;
    }

    // 處理隊伍配置
    processTeamConfig(config) {
        const {
            cardNames = [],
            levels = [],
            breakthroughs = [],
            advancements = [],
            partnerBondLevel = 25,
            userConstellationMatch = 0,
            userPerfectAlignment = false
        } = config;

        // 將卡片名稱轉換為卡片物件
        const cards = cardNames.map(name => {
            if (typeof name === 'string') {
                return this.dependencies.cardDatabase.getCardByName(name);
            }
            return name; // 如果已經是物件則直接返回
        });

        // 填充預設值
        const processedConfig = {
            cards,
            levels: this.fillArray(levels, cards.length, 80),
            breakthroughs: this.fillArray(breakthroughs, cards.length, 1),
            advancements: this.fillArray(advancements, cards.length, 3),
            partnerBondLevel,
            userConstellationMatch,
            userPerfectAlignment
        };

        return processedConfig;
    }

    // 填充數組到指定長度
    fillArray(array, targetLength, defaultValue) {
        const result = [...array];
        while (result.length < targetLength) {
            result.push(defaultValue);
        }
        return result.slice(0, targetLength);
    }

    // 獲取搭檔的所有卡片
    getPartnerCards(partnerId) {
        this.checkInitialized();
        return this.dependencies.cardFilters.getCardsByPartner(partnerId);
    }

    // 篩選卡片
    filterCards(filters) {
        this.checkInitialized();
        return this.dependencies.cardFilters.filterCards(filters.partnerId, filters);
    }

    // 搜尋卡片
    searchCards(searchTerm) {
        this.checkInitialized();
        return this.dependencies.cardFilters.searchCards(searchTerm);
    }

    // 獲取推薦卡片
    getRecommendations(currentTeam, criteria = {}) {
        this.checkInitialized();
        return this.dependencies.cardFilters.recommendCards(currentTeam, criteria);
    }

    // 優化隊伍配置
    optimizeTeam(teamConfig) {
        this.checkInitialized();
        const processedConfig = this.processTeamConfig(teamConfig);
        return this.dependencies.teamCalculator.optimizeTeamConfiguration(processedConfig);
    }

    // 比較多個隊伍配置
    compareTeams(teamConfigs) {
        this.checkInitialized();
        const processedConfigs = teamConfigs.map(config => this.processTeamConfig(config));
        return this.dependencies.teamCalculator.compareTeamConfigurations(processedConfigs);
    }

    // 批量計算搭檔卡片
    batchCalculatePartner(partnerId, level = 80, advancement = 3) {
        this.checkInitialized();
        return this.dependencies.teamCalculator.batchCalculateByPartner(partnerId, level, advancement);
    }

    // 獲取職業相關信息
    getProfessions(partnerId = null) {
        this.checkInitialized();
        if (partnerId) {
            return this.dependencies.cardDatabase.getProfessionsByPartner(partnerId);
        }
        return this.dependencies.cardDatabase.getAllProfessions();
    }

    // 獲取武器信息
    getWeapons(professionName = null) {
        this.checkInitialized();
        if (professionName) {
            return this.dependencies.cardDatabase.getWeaponsByProfession(professionName);
        }
        return this.dependencies.cardDatabase.getAllWeapons();
    }

    // 計算搭檔牽絆加成
    calculateBondBonus(bondLevel) {
        this.checkInitialized();
        return this.dependencies.partnerProfessionUtils.calculatePartnerBondBonus(bondLevel);
    }

    // 獲取職業推薦
    getProfessionRecommendations(currentProfessions, criteria = {}) {
        this.checkInitialized();
        return this.dependencies.partnerProfessionUtils.recommendProfessionCombination(currentProfessions, criteria.maxRecommendations);
    }

    // 生成職業配置報告
    generateProfessionReport(professions, bondLevels = {}) {
        this.checkInitialized();
        return this.dependencies.partnerProfessionUtils.generateProfessionReport(professions, bondLevels);
    }

    // 芯核相關方法
    getCoreTypes() {
        this.checkInitialized();
        return this.dependencies.coreSystem.getCoreTypes();
    }

    // 根據卡片類別獲取可用芯核
    getAvailableCores(cardCategory) {
        this.checkInitialized();
        return this.dependencies.coreSystem.getAvailableCoresByCardCategory(cardCategory);
    }

    // 驗證芯核配置
    validateCoreConfig(coreType, cardCategory, mainStat) {
        this.checkInitialized();
        return this.dependencies.coreSystem.validateCoreConfiguration(coreType, cardCategory, mainStat);
    }

    // 計算芯核加成
    calculateCoreBonus(coreConfig, baseStats, cardCategory) {
        this.checkInitialized();
        return this.dependencies.coreSystem.calculateCardCoreBonus(coreConfig, baseStats, cardCategory);
    }

    // 生成芯核模板
    generateCoreTemplate(coreType) {
        this.checkInitialized();
        return this.dependencies.coreSystem.generateCoreTemplate(coreType);
    }

    // 獲取所有搭檔
    getAllPartners() {
        this.checkInitialized();
        return this.dependencies.cardDatabase.getAllPartners();
    }

    // 獲取所有卡片
    getAllCards() {
        this.checkInitialized();
        return this.dependencies.cardDatabase.getAllCards();
    }

    // 獲取統計資訊
    getStatistics() {
        this.checkInitialized();
        const cardStats = this.dependencies.cardFilters.getFilterStatistics();
        const professionStats = this.dependencies.partnerProfessionUtils.getProfessionStatistics();
        
        return {
            cards: cardStats,
            professions: professionStats,
            summary: {
                totalCards: cardStats.total,
                totalProfessions: professionStats.total,
                totalPartners: Object.keys(cardStats.byPartner).length
            }
        };
    }

    // 驗證計算準確性
    validateCalculations() {
        this.checkInitialized();
        console.log('=== 開始驗證計算準確性 ===');
        
        // 1. 驗證基礎屬性計算
        console.log('1. 驗證基礎屬性計算...');
        const attackCard80 = this.dependencies.baseStatsCalculator.calculateBaseStats('attack', 80);
        const defenseCard80 = this.dependencies.baseStatsCalculator.calculateBaseStats('defense', 80);
        const lifeCard80 = this.dependencies.baseStatsCalculator.calculateBaseStats('life', 80);
        
        console.log('80級基礎屬性：');
        console.log('攻擊卡:', attackCard80);
        console.log('防禦卡:', defenseCard80);
        console.log('生命卡:', lifeCard80);
        
        // 2. 驗證屬性加成計算
        console.log('2. 驗證屬性加成計算...');
        const sunCard80_3 = this.dependencies.bonusCalculator.calculateAttributeBonus('日卡', 3, 80, true);
        const moonCard80_3 = this.dependencies.bonusCalculator.calculateAttributeBonus('月卡', 3, 80, true);
        
        console.log('80級覺醒3階屬性加成：');
        console.log('日卡暴擊傷害:', sunCard80_3.toFixed(1) + '%');
        console.log('月卡暴擊率:', moonCard80_3.toFixed(1) + '%');
        console.log('比例關係:', (sunCard80_3 / moonCard80_3).toFixed(2) + ':1');
        
        // 3. 驗證隊伍計算器
        console.log('3. 驗證隊伍計算器...');
        this.dependencies.teamCalculator.validateCalculations();
        
        console.log('✅ 驗證完成');
        
        return {
            baseStats: { attackCard80, defenseCard80, lifeCard80 },
            attributeBonus: { sunCard80_3, moonCard80_3 }
        };
    }

    // 運行使用示例
    runExamples() {
        console.log('=== 運行使用示例 ===');
        
        try {
            // 示例1: 計算單張卡片數值
            console.log('1. 計算單張卡片數值...');
            const cardStats = this.calculateSingleCard('擁雪見緣', {
                level: 80,
                advancement: 3,
                userConstellationMatch: 2,
                userPerfectAlignment: true
            });
            console.log('擁雪見緣 80級3階數值:', cardStats);

            // 示例2: 計算隊伍總屬性
            console.log('2. 計算隊伍總屬性...');
            const teamStats = this.calculateTeam({
                cardNames: ['擁雪見緣', '永恆封塵', '失序', '抵此心上', '脈脈傾言', '枕月眠'],
                levels: [80, 80, 80, 80, 80, 80],
                breakthroughs: [1, 1, 1, 1, 1, 1],
                advancements: [3, 3, 3, 3, 3, 3],
                partnerBondLevel: 50,
                userConstellationMatch: 2,
                userPerfectAlignment: true
            });
            console.log('隊伍總屬性:', teamStats);

            // 示例3: 批量計算搭檔卡片
            console.log('3. 批量計算黎深卡片...');
            const lishenCards = this.batchCalculatePartner('lishen', 80, 3);
            console.log('黎深所有卡片80級3階數值:', lishenCards);

            // 示例4: 獲取推薦卡片
            console.log('4. 獲取推薦卡片...');
            const currentTeam = [
                this.dependencies.cardDatabase.getCardByName('擁雪見緣'),
                this.dependencies.cardDatabase.getCardByName('永恆封塵')
            ].filter(Boolean);
            
            const recommendations = this.getRecommendations(currentTeam, { maxRecommendations: 3 });
            console.log('推薦卡片:', recommendations.map(card => card.name));

            // 示例5: 芯核系統示例
            console.log('5. 芯核系統示例...');
            const coreTypes = this.getCoreTypes();
            console.log('可用芯核類型:', Object.keys(coreTypes));
            
            const alphaTemplate = this.generateCoreTemplate('alpha');
            console.log('α芯核模板:', alphaTemplate);

            // 示例6: 職業系統示例
            console.log('6. 職業系統示例...');
            const professions = this.getProfessions('lishen');
            console.log('黎深的職業:', professions.map(p => p.name));
            
            const bondBonus = this.calculateBondBonus(25);
            console.log('25級牽絆加成:', bondBonus);

            console.log('✅ 示例運行完成');
            
        } catch (error) {
            console.error('❌ 示例運行失敗:', error);
        }
    }

    // 導出配置到JSON
    exportTeamConfig(teamConfig) {
        this.checkInitialized();
        const processedConfig = this.processTeamConfig(teamConfig);
        
        return {
            cards: processedConfig.cards.map(card => ({
                id: card.id,
                name: card.name
            })),
            levels: processedConfig.levels,
            breakthroughs: processedConfig.breakthroughs,
            advancements: processedConfig.advancements,
            partnerBondLevel: processedConfig.partnerBondLevel,
            userConstellationMatch: processedConfig.userConstellationMatch,
            userPerfectAlignment: processedConfig.userPerfectAlignment,
            exportTime: new Date().toISOString()
        };
    }

    // 從JSON導入配置
    importTeamConfig(jsonConfig) {
        this.checkInitialized();
        
        const cardNames = jsonConfig.cards.map(cardInfo => cardInfo.name || cardInfo.id);
        
        return {
            cardNames,
            levels: jsonConfig.levels || [],
            breakthroughs: jsonConfig.breakthroughs || [],
            advancements: jsonConfig.advancements || [],
            partnerBondLevel: jsonConfig.partnerBondLevel || 25,
            userConstellationMatch: jsonConfig.userConstellationMatch || 0,
            userPerfectAlignment: jsonConfig.userPerfectAlignment || false
        };
    }

    // 生成隊伍報告
    generateTeamReport(teamConfig) {
        this.checkInitialized();
        
        const processedConfig = this.processTeamConfig(teamConfig);
        const teamStats = this.dependencies.teamCalculator.calculateTeamStats(processedConfig);
        const optimization = this.dependencies.teamCalculator.optimizeTeamConfiguration(processedConfig);
        
        return {
            teamComposition: {
                totalCards: processedConfig.cards.length,
                cards: processedConfig.cards.map((card, index) => ({
                    name: card.name,
                    category: card.category,
                    type: card.type,
                    constellation: card.constellation,
                    partner: card.partner,
                    level: processedConfig.levels[index],
                    breakthrough: processedConfig.breakthroughs[index],
                    advancement: processedConfig.advancements[index]
                }))
            },
            currentStats: teamStats,
            totalPower: this.dependencies.teamCalculator.calculateTotalPower(teamStats),
            optimization: optimization,
            analysis: this.dependencies.cardFilters.analyzeTeamComposition(processedConfig.cards),
            generatedAt: new Date().toISOString()
        };
    }

    // 獲取可用的API方法清單
    getAvailableMethods() {
        return {
            '單卡計算': [
                'calculateSingleCard(cardName, config)',
                'calculateSingleCardWithCore(cardName, config)',
                'batchCalculatePartner(partnerId, level, advancement)'
            ],
            '隊伍計算': [
                'calculateTeam(teamConfig)',
                'calculateTeamWithCore(teamConfig)',
                'optimizeTeam(teamConfig)',
                'compareTeams(teamConfigs)',
                'generateTeamReport(teamConfig)'
            ],
            '卡片管理': [
                'getAllCards()',
                'getPartnerCards(partnerId)',
                'filterCards(filters)',
                'searchCards(searchTerm)',
                'getRecommendations(currentTeam, criteria)'
            ],
            '職業系統': [
                'getProfessions(partnerId)',
                'getWeapons(professionName)',
                'calculateBondBonus(bondLevel)',
                'getProfessionRecommendations(currentProfessions, criteria)',
                'generateProfessionReport(professions, bondLevels)'
            ],
            '芯核系統': [
                'getCoreTypes()',
                'getAvailableCores(cardCategory)',
                'validateCoreConfig(coreType, cardCategory, mainStat)',
                'calculateCoreBonus(coreConfig, baseStats, cardCategory)',
                'generateCoreTemplate(coreType)'
            ],
            '數據查詢': [
                'getAllPartners()',
                'getStatistics()',
                'validateCalculations()'
            ],
            '配置管理': [
                'exportTeamConfig(teamConfig)',
                'importTeamConfig(jsonConfig)'
            ]
        };
    }
}

// 創建全域應用實例
const teamCalculatorApp = new TeamCalculatorApp();

// 提供簡化的全域API
const Calculator = {
    // 單卡計算
    calculateCard: (cardName, config) => teamCalculatorApp.calculateSingleCard(cardName, config),
    calculateCardWithCore: (cardName, config) => teamCalculatorApp.calculateSingleCardWithCore(cardName, config),
    
    // 隊伍計算
    calculateTeam: (teamConfig) => teamCalculatorApp.calculateTeam(teamConfig),
    calculateTeamWithCore: (teamConfig) => teamCalculatorApp.calculateTeamWithCore(teamConfig),
    
    // 卡片相關
    getCards: (partnerId) => teamCalculatorApp.getPartnerCards(partnerId),
    search: (term) => teamCalculatorApp.searchCards(term),
    recommend: (team, criteria) => teamCalculatorApp.getRecommendations(team, criteria),
    
    // 職業相關
    getProfessions: (partnerId) => teamCalculatorApp.getProfessions(partnerId),
    getWeapons: (professionName) => teamCalculatorApp.getWeapons(professionName),
    calculateBond: (bondLevel) => teamCalculatorApp.calculateBondBonus(bondLevel),
    professionReport: (professions, bondLevels) => teamCalculatorApp.generateProfessionReport(professions, bondLevels),
    
    // 芯核相關
    getCores: (cardCategory) => teamCalculatorApp.getAvailableCores(cardCategory),
    validateCore: (coreType, cardCategory, mainStat) => teamCalculatorApp.validateCoreConfig(coreType, cardCategory, mainStat),
    coreTemplate: (coreType) => teamCalculatorApp.generateCoreTemplate(coreType),
    coreBonus: (coreConfig, baseStats, cardCategory) => teamCalculatorApp.calculateCoreBonus(coreConfig, baseStats, cardCategory),
    
    // 通用功能
    optimize: (teamConfig) => teamCalculatorApp.optimizeTeam(teamConfig),
    report: (teamConfig) => teamCalculatorApp.generateTeamReport(teamConfig),
    validate: () => teamCalculatorApp.validateCalculations(),
    help: () => teamCalculatorApp.getAvailableMethods(),
    stats: () => teamCalculatorApp.getStatistics()
};

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamCalculatorApp, teamCalculatorApp, Calculator };
}

if (typeof window !== 'undefined') {
    window.TeamCalculatorApp = TeamCalculatorApp;
    window.teamCalculatorApp = teamCalculatorApp;
    window.Calculator = Calculator;
    
    // 提供全域快捷方式
    window.calc = Calculator;
}

// 當所有依賴都載入後自動初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 戰鬥隊伍組建計算機已準備就緒');
        console.log('💡 使用 Calculator 或 calc 來訪問API');
        console.log('📚 使用 calc.help() 查看可用方法');
    });
}
