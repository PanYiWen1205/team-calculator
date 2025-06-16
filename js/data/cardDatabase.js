// cardDatabase.js - 卡牌基礎數據
class CardDatabase {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // 卡牌數據庫
        this.cards = [
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

        // 搭檔數據
        this.partners = [
            { id: 'lishen', name: '黎深' },
            { id: 'shenxinghui', name: '沈星回' },
            { id: 'qiyu', name: '祁煜' },
            { id: 'qinche', name: '秦徹' },
            { id: 'xiayizhou', name: '夏以晝' }
        ];

        // 職業數據
        this.professions = [
            { id: 'eternal_prophet', name: '永恆先知', partner: 'lishen', weapon: 'eternal_voice', cardType: 'defense' },
            { id: 'jiuli_commander', name: '九黎司命', partner: 'lishen', weapon: 'divine_rain', cardType: 'attack' },
            { id: 'endless_raider', name: '無盡掠奪者', partner: 'qinche', weapon: 'hunter_rabbit_700', cardType: 'attack' },
            { id: 'abyss_master', name: '深淵主宰', partner: 'qinche', weapon: 'soul_reaper', cardType: 'life' },
            { id: 'light_chaser', name: '逐光騎士', partner: 'shenxinghui', weapon: 'light_blade', cardType: 'attack' },
            { id: 'light_hunter', name: '光獵', partner: 'shenxinghui', weapon: 'moon_chaser', cardType: 'defense' },
            { id: 'fleet_officer', name: '遠空執艦官', partner: 'xiayizhou', weapon: 'crack_sky_sn', cardType: 'defense' },
            { id: 'weapon_x02', name: '終極兵器X-02', partner: 'xiayizhou', weapon: 'awakening_vitality', cardType: 'attack' },
            { id: 'deep_sea_diver', name: '深海潛行者', partner: 'qiyu', weapon: 'shadow_breaker', cardType: 'attack' },
            { id: 'tidal_god', name: '潮汐之神', partner: 'qiyu', weapon: 'sea_caller', cardType: 'life' }
        ];

        // 武器數據
        this.weapons = [
            { id: 'eternal_voice', name: '永恆聖音', profession: '永恆先知' },
            { id: 'divine_rain', name: '神靈雨', profession: '九黎司命' },
            { id: 'hunter_rabbit_700', name: '獵兔700', profession: '無盡掠奪者' },
            { id: 'soul_reaper', name: '死魂靈', profession: '深淵主宰' },
            { id: 'light_blade', name: '溯光之刃', profession: '逐光騎士' },
            { id: 'moon_chaser', name: '逐月者', profession: '光獵' },
            { id: 'crack_sky_sn', name: '裂穹-SN', profession: '遠空執艦官' },
            { id: 'awakening_vitality', name: '覺醒生機', profession: '終極兵器X-02' },
            { id: 'shadow_breaker', name: '潛影破沙', profession: '深海潛行者' },
            { id: 'sea_caller', name: '喚海映潮', profession: '潮汐之神' }
        ];

        // 搭檔職業配對關係
        this.partnerProfessionMap = {
            'lishen': ['eternal_prophet', 'jiuli_commander'],
            'qinche': ['endless_raider', 'abyss_master'],
            'shenxinghui': ['light_chaser', 'light_hunter'],
            'xiayizhou': ['fleet_officer', 'weapon_x02'],
            'qiyu': ['deep_sea_diver', 'tidal_god']
        };

        // 職業武器配對關係
        this.professionWeaponMap = {
            'eternal_prophet': 'eternal_voice',
            'jiuli_commander': 'divine_rain',
            'endless_raider': 'hunter_rabbit_700',
            'abyss_master': 'soul_reaper',
            'light_chaser': 'light_blade',
            'light_hunter': 'moon_chaser',
            'fleet_officer': 'crack_sky_sn',
            'weapon_x02': 'awakening_vitality',
            'deep_sea_diver': 'shadow_breaker',
            'tidal_god': 'sea_caller'
        };

        // 星譜對照
        this.constellations = {
            blue: '藍弧', 
            green: '綠珥', 
            purple: '紫輝', 
            yellow: '黃璃', 
            red: '紅漪', 
            pink: '粉珀'
        };

        // 卡片類型對照
        this.cardTypes = { 
            attack: '攻擊', 
            defense: '防禦', 
            life: '生命' 
        };
    }

    // 獲取所有卡片
    getAllCards() {
        return this.cards;
    }

    // 根據ID獲取卡片
    getCardById(id) {
        return this.cards.find(card => card.id === id);
    }

    // 根據名稱獲取卡片
    getCardByName(name) {
        return this.cards.find(card => card.name === name);
    }

    // 獲取所有搭檔
    getAllPartners() {
        return this.partners;
    }

    // 根據ID獲取搭檔
    getPartnerById(id) {
        return this.partners.find(partner => partner.id === id);
    }

    // 根據ID獲取職業
    getProfessionById(id) {
        return this.professions.find(profession => profession.id === id);
    }

    // 根據搭檔獲取職業
    getProfessionsByPartner(partnerId) {
        return this.professions.filter(profession => profession.partner === partnerId);
    }

    // 根據ID獲取武器
    getWeaponById(id) {
        return this.weapons.find(weapon => weapon.id === id);
    }

    // 根據職業名稱獲取武器
    getWeaponsByProfession(professionName) {
        return this.weapons.filter(weapon => weapon.profession === professionName);
    }

    // 獲取所有職業
    getAllProfessions() {
        return this.professions;
    }

    // 獲取所有武器
    getAllWeapons() {
        return this.weapons;
    }

    // 獲取星譜對照表
    getConstellations() {
        return this.constellations;
    }

    // 獲取卡片類型對照表
    getCardTypes() {
        return this.cardTypes;
    }

    // 獲取搭檔職業配對關係
    getPartnerProfessionMap() {
        return this.partnerProfessionMap;
    }

    // 獲取職業武器配對關係
    getProfessionWeaponMap() {
        return this.professionWeaponMap;
    }
}

// 創建全域實例
const cardDatabase = new CardDatabase();

// 導出 (支援多種模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CardDatabase, cardDatabase };
}

if (typeof window !== 'undefined') {
    window.CardDatabase = CardDatabase;
    window.cardDatabase = cardDatabase;
}
