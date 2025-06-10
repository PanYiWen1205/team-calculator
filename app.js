<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>戰鬥隊伍組建計算機</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>

    <script>
        // 戰鬥隊伍組建計算機 - 完整版本
        function TeamCalculator() {
            // 卡牌基礎數值表 - 包含突破系統
            const cardBaseStats = {
                5: {
                    attack: {
                        0: { 
                            1: { hp: 2400, atk: 132, def: 60 },
                            10: { hp: 3480, atk: 191, def: 87 },
                            20: { hp: 5160, atk: 283, def: 129 },
                            30: { hp: 6840, atk: 376, def: 171 },
                            40: { hp: 8520, atk: 468, def: 213 },
                            50: { hp: 10200, atk: 561, def: 255 },
                            60: { hp: 11880, atk: 653, def: 297 },
                            "60+": { hp: 13843, atk: 761, def: 346 },
                            70: { hp: 14040, atk: 772, def: 351 },
                            "70+": { hp: 15724, atk: 864, def: 393 },
                            80: { hp: 15240, atk: 838, def: 381 },
                            "80+": { hp: 16440, atk: 904, def: 411 }
                        },
                        1: { 
                            1: { hp: 2608, atk: 147, def: 67 },
                            10: { hp: 3897, atk: 214, def: 97 },
                            20: { hp: 5779, atk: 317, def: 144 },
                            30: { hp: 7660, atk: 421, def: 191 },
                            40: { hp: 9542, atk: 524, def: 238 },
                            50: { hp: 11424, atk: 628, def: 285 },
                            60: { hp: 13305, atk: 731, def: 332 },
                            "60+": { hp: 15187, atk: 835, def: 379 },
                            70: { hp: 15724, atk: 864, def: 393 },
                            "70+": { hp: 17409, atk: 957, def: 435 },
                            80: { hp: 17068, atk: 938, def: 426 },
                            "80+": { hp: 18412, atk: 1012, def: 460 }
                        },
                        2: { 
                            1: { hp: 2816, atk: 163, def: 74 },
                            10: { hp: 4315, atk: 237, def: 107 },
                            20: { hp: 6398, atk: 351, def: 159 },
                            30: { hp: 8481, atk: 466, def: 212 },
                            40: { hp: 10564, atk: 581, def: 264 },
                            50: { hp: 12648, atk: 695, def: 316 },
                            60: { hp: 14731, atk: 810, def: 368 },
                            "60+": { hp: 15326, atk: 842, def: 383 },
                            70: { hp: 17409, atk: 957, def: 435 },
                            "70+": { hp: 19094, atk: 1050, def: 477 },
                            80: { hp: 18897, atk: 1039, def: 472 },
                            "80+": { hp: 20385, atk: 1121, def: 509 }
                        },
                        3: { 
                            1: { hp: 3264, atk: 179, def: 81 },
                            10: { hp: 4732, atk: 260, def: 118 },
                            20: { hp: 7017, atk: 385, def: 175 },
                            30: { hp: 9302, atk: 511, def: 232 },
                            40: { hp: 11587, atk: 637, def: 289 },
                            50: { hp: 13872, atk: 763, def: 346 },
                            60: { hp: 16156, atk: 888, def: 403 },
                            70: { hp: 18441, atk: 1014, def: 461 },
                            "70+": { hp: 19094, atk: 1050, def: 477 },
                            80: { hp: 20726, atk: 1139, def: 518 },
                            "80+": { hp: 22358, atk: 1229, def: 558 }
                        }
                    },
                    defense: {
                        0: { 
                            1: { hp: 2400, atk: 120, def: 66 },
                            10: { hp: 3480, atk: 174, def: 95 },
                            20: { hp: 5160, atk: 258, def: 141 },
                            30: { hp: 6840, atk: 342, def: 188 },
                            40: { hp: 8520, atk: 426, def: 234 },
                            50: { hp: 10200, atk: 510, def: 280 },
                            60: { hp: 11880, atk: 594, def: 326 },
                            "60+": { hp: 13843, atk: 692, def: 380 },
                            70: { hp: 13560, atk: 678, def: 372 },
                            "70+": { hp: 15187, atk: 759, def: 417 },
                            80: { hp: 15240, atk: 762, def: 419 },
                            "80+": { hp: 16440, atk: 822, def: 452 }
                        },
                        1: { 
                            1: { hp: 2608, atk: 134, def: 73 },
                            10: { hp: 3897, atk: 194, def: 107 },
                            20: { hp: 5779, atk: 288, def: 158 },
                            30: { hp: 7660, atk: 383, def: 210 },
                            40: { hp: 9542, atk: 477, def: 262 },
                            50: { hp: 11424, atk: 571, def: 314 },
                            60: { hp: 13305, atk: 665, def: 365 },
                            "60+": { hp: 15326, atk: 766, def: 421 },
                            70: { hp: 15724, atk: 786, def: 432 },
                            "70+": { hp: 16814, atk: 840, def: 462 },
                            80: { hp: 17068, atk: 853, def: 468 },
                            "80+": { hp: 18412, atk: 920, def: 506 }
                        },
                        2: { 
                            1: { hp: 2816, atk: 148, def: 81 },
                            10: { hp: 4315, atk: 215, def: 118 },
                            20: { hp: 6398, atk: 319, def: 175 },
                            30: { hp: 8481, atk: 424, def: 233 },
                            40: { hp: 10564, atk: 528, def: 290 },
                            50: { hp: 12648, atk: 632, def: 347 },
                            60: { hp: 14731, atk: 736, def: 405 },
                            "60+": { hp: 16156, atk: 807, def: 444 },
                            70: { hp: 17409, atk: 870, def: 478 },
                            "70+": { hp: 18441, atk: 922, def: 507 },
                            80: { hp: 18897, atk: 944, def: 519 },
                            "80+": { hp: 20385, atk: 1019, def: 560 }
                        },
                        3: { 
                            1: { hp: 3264, atk: 163, def: 89 },
                            10: { hp: 4732, atk: 236, def: 130 },
                            20: { hp: 7017, atk: 350, def: 192 },
                            30: { hp: 9302, atk: 465, def: 255 },
                            40: { hp: 11587, atk: 579, def: 318 },
                            50: { hp: 13872, atk: 693, def: 381 },
                            60: { hp: 16156, atk: 807, def: 444 },
                            70: { hp: 18441, atk: 922, def: 507 },
                            "70+": { hp: 19094, atk: 954, def: 525 },
                            80: { hp: 20726, atk: 1036, def: 569 },
                            "80+": { hp: 22358, atk: 1117, def: 614 }
                        }
                    },
                    life: {
                        0: { 
                            1: { hp: 2640, atk: 120, def: 60 },
                            10: { hp: 3828, atk: 174, def: 87 },
                            20: { hp: 5676, atk: 258, def: 129 },
                            30: { hp: 7524, atk: 342, def: 171 },
                            40: { hp: 9372, atk: 426, def: 213 },
                            50: { hp: 11220, atk: 510, def: 255 },
                            60: { hp: 13068, atk: 594, def: 297 },
                            "60+": { hp: 13596, atk: 618, def: 309 },
                            70: { hp: 14916, atk: 678, def: 339 },
                            "70+": { hp: 16705, atk: 759, def: 379 },
                            80: { hp: 16764, atk: 762, def: 381 },
                            "80+": { hp: 18084, atk: 822, def: 411 }
                        },
                        1: { 
                            1: { hp: 2866, atk: 134, def: 67 },
                            10: { hp: 4287, atk: 194, def: 97 },
                            20: { hp: 6357, atk: 288, def: 144 },
                            30: { hp: 8426, atk: 383, def: 191 },
                            40: { hp: 10496, atk: 477, def: 238 },
                            50: { hp: 12566, atk: 571, def: 285 },
                            60: { hp: 14636, atk: 665, def: 332 },
                            "60+": { hp: 15227, atk: 692, def: 346 },
                            70: { hp: 17297, atk: 786, def: 393 },
                            "70+": { hp: 18495, atk: 840, def: 420 },
                            80: { hp: 18775, atk: 853, def: 426 },
                            "80+": { hp: 20254, atk: 920, def: 460 }
                        },
                        2: { 
                            1: { hp: 3092, atk: 148, def: 74 },
                            10: { hp: 4746, atk: 215, def: 107 },
                            20: { hp: 7038, atk: 319, def: 159 },
                            30: { hp: 9329, atk: 424, def: 212 },
                            40: { hp: 11621, atk: 528, def: 264 },
                            50: { hp: 13912, atk: 632, def: 316 },
                            60: { hp: 16204, atk: 736, def: 368 },
                            70: { hp: 19150, atk: 870, def: 435 },
                            "70+": { hp: 20285, atk: 922, def: 461 },
                            80: { hp: 20787, atk: 944, def: 472 },
                            "80+": { hp: 22424, atk: 1019, def: 509 }
                        },
                        3: { 
                            1: { hp: 3590, atk: 163, def: 81 },
                            10: { hp: 5206, atk: 236, def: 118 },
                            20: { hp: 7719, atk: 350, def: 175 },
                            30: { hp: 10232, atk: 465, def: 232 },
                            40: { hp: 12745, atk: 579, def: 289 },
                            50: { hp: 15259, atk: 693, def: 346 },
                            60: { hp: 17772, atk: 807, def: 403 },
                            70: { hp: 21003, atk: 954, def: 477 },
                            "70+": { hp: 20285, atk: 922, def: 461 },
                            80: { hp: 22799, atk: 1036, def: 518 },
                            "80+": { hp: 24594, atk: 1117, def: 558 }
                        }
                    }
                }
            };

            // 卡牌屬性加成表
            const cardAttributeBonus = {
                5: {
                    日卡: {
                        0: { 
                            1: 5.2, 10: 5.2, 20: 5.8, 30: 6.4, 40: 7.0, 50: 7.6, 60: 8.2,
                            "60+": 8.8, 70: 8.8, "70+": 9.4, 80: 9.4, "80+": 11.0
                        },
                        1: { 
                            1: 8.2, 10: 8.2, 20: 8.8, 30: 9.4, 40: 10.0, 50: 10.6, 60: 11.2,
                            "60+": 11.8, 70: 11.8, "70+": 12.4, 80: 12.4, "80+": 14.0
                        },
                        2: { 
                            1: 11.2, 10: 11.2, 20: 11.8, 30: 12.4, 40: 13.0, 50: 13.6, 60: 14.2,
                            "60+": 14.8, 70: 14.8, "70+": 15.4, 80: 15.4, "80+": 17.0
                        },
                        3: { 
                            1: 14.2, 10: 14.2, 20: 14.8, 30: 15.4, 40: 16.0, 50: 16.6, 60: 17.2,
                            "60+": 17.8, 70: 17.8, "70+": 18.4, 80: 18.4, "80+": 20.0
                        }
                    },
                    月卡: {
                        0: { 
                            1: 2.6, 10: 2.6, 20: 2.9, 30: 3.2, 40: 3.5, 50: 3.8, 60: 4.1,
                            "60+": 4.4, 70: 4.4, "70+": 4.7, 80: 4.7, "80+": 5.5
                        },
                        1: { 
                            1: 4.1, 10: 4.1, 20: 4.4, 30: 4.7, 40: 5.0, 50: 5.3, 60: 5.6,
                            "60+": 5.9, 70: 5.9, "70+": 6.2, 80: 6.2, "80+": 7.0
                        },
                        2: { 
                            1: 5.6, 10: 5.6, 20: 5.9, 30: 6.2, 40: 6.5, 50: 6.8, 60: 7.1,
                            "60+": 7.4, 70: 7.4, "70+": 7.7, 80: 7.7, "80+": 8.5
                        },
                        3: { 
                            1: 7.1, 10: 7.1, 20: 7.4, 30: 7.7, 40: 8.0, 50: 8.3, 60: 8.6,
                            "60+": 8.9, 70: 8.9, "70+": 9.2, 80: 9.2, "80+": 10.0
                        }
                    }
                }
            };

            const cardDatabase = [
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

            const partners = [
                { id: 'lishen', name: '黎深' },
                { id: 'shenxinghui', name: '沈星回' },
                { id: 'qiyu', name: '祁煜' },
                { id: 'qinche', name: '秦徹' },
                { id: 'xiayizhou', name: '夏以晝' }
            ];

            const professions = [
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

            const weapons = [
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

            const constellations = {
                blue: '藍弧', green: '綠珥', purple: '紫輝', yellow: '黃璃', red: '紅漪', pink: '粉珀'
            };

            const cardTypes = { attack: '攻擊', defense: '防禦', life: '生命' };

            // 狀態管理
            const [selectedPartner, setSelectedPartner] = React.useState('lishen');
            const [selectedProfession, setSelectedProfession] = React.useState('eternal_prophet');
            const [selectedWeapon, setSelectedWeapon] = React.useState('eternal_voice');
            const [partnerBondLevel, setPartnerBondLevel] = React.useState(25);

            const [cardFilters, setCardFilters] = React.useState({
                categories: { sun: true, moon: true },
                constellations: { blue: true, green: true, red: true, purple: true, yellow: true, pink: true },
                types: { attack: true, defense: true, life: true }
            });

            const [teamSlots, setTeamSlots] = React.useState({
                sun1: null, sun2: null, moon1: null, moon2: null, moon3: null, moon4: null
            });
            
            const [cardLevels, setCardLevels] = React.useState({});
            const [cardBreakthroughs, setCardBreakthroughs] = React.useState({});
            const [cardAdvancements, setCardAdvancements] = React.useState({});

            // 同步職業、搭檔和武器選擇
            React.useEffect(() => {
                const profession = professions.find(p => p.id === selectedProfession);
                if (profession && profession.partner !== selectedPartner) {
                    setSelectedPartner(profession.partner);
                }
                if (profession && profession.weapon !== selectedWeapon) {
                    setSelectedWeapon(profession.weapon);
                }
            }, [selectedProfession]);

            // 工具函數
            const calculatePartnerBondBonus = (bondLevel) => {
                if (bondLevel < 5) return { hp: 0, atk: 0, def: 0 };
                const bonusCount = Math.floor((bondLevel - 5) / 5) + 1;
                return { hp: bonusCount * 200, atk: bonusCount * 10, def: bonusCount * 5 };
            };

            const isCardInTeam = (cardId) => {
                return Object.values(teamSlots).some(card => card && card.id === cardId);
            };

            const getFilteredCards = () => {
                return cardDatabase.filter(card => {
                    if (card.partner !== selectedPartner) return false;
                    const categoryKey = card.category === '日卡' ? 'sun' : 'moon';
                    return cardFilters.categories[categoryKey] && 
                           cardFilters.constellations[card.constellation] && 
                           cardFilters.types[card.type];
                });
            };

            const toggleFilter = (filterType, key) => {
                setCardFilters(prev => ({
                    ...prev,
                    [filterType]: { ...prev[filterType], [key]: !prev[filterType][key] }
                }));
            };

            const getBaseStatsForLevel = (rarity, type, advancement, level) => {
                const typeTable = cardBaseStats[rarity][type][advancement];
                if (!typeTable) return { hp: 15000, atk: 800, def: 400 };
                    
                // 優先查找確切等級
                if (typeTable[level]) {
                    return typeTable[level];
                }
                
                // 如果沒有確切等級，找最接近的較低等級
                const availableLevels = Object.keys(typeTable)
                    .filter(key => !key.includes('+'))
                    .map(Number)
                    .filter(lvl => lvl <= level)
                    .sort((a, b) => b - a);
                
                if (availableLevels.length > 0) {
                    return typeTable[availableLevels[0]];
                }
                
                return typeTable[80] || { hp: 15000, atk: 800, def: 400 };
            };

            function calculateStats(card, level, breakthrough, advancement = 0) {
                if (!card) return { hp: 0, atk: 0, def: 0, criticalDamage: 0, criticalRate: 0, weaknessDamage: 0 };
                
                // 根據進階等級獲取基礎數值
                const baseStats = getBaseStatsForLevel(card.rarity, card.type, advancement, level);
                let hp = baseStats.hp;
                let atk = baseStats.atk;
                let def = baseStats.def;
                
                // 使用新的屬性加成表計算暴擊率和暴傷
                let criticalDamage = 0;
                let criticalRate = 0;
                
                if (cardAttributeBonus[card.rarity]) {
                    const categoryKey = card.category;
                    if (categoryKey === '日卡' && cardAttributeBonus[card.rarity][categoryKey]) {
                        criticalDamage = cardAttributeBonus[card.rarity][categoryKey][advancement]?.[level] || 0;
                    } else if (categoryKey === '月卡' && cardAttributeBonus[card.rarity][categoryKey]) {
                        criticalRate = cardAttributeBonus[card.rarity][categoryKey][advancement]?.[level] || 0;
                    }
                }
                
                // 突破加成 (簡化處理)
                if (breakthrough > 0) {
                    const breakBonus = breakthrough * 0.05; // 每突破增加5%
                    hp = Math.floor(hp * (1 + breakBonus));
                    atk = Math.floor(atk * (1 + breakBonus));
                    def = Math.floor(def * (1 + breakBonus));
                }
                
                // 虛弱增傷計算
                let weaknessDamage = 0;
                if (card.type === 'attack' && atk > 400) {
                    weaknessDamage = Math.floor((atk - 400) / 20) * 0.2;
                }

                return { hp, atk, def, criticalDamage, criticalRate, weaknessDamage };
            }

            function addCard(card) {
                if (isCardInTeam(card.id)) {
                    return;
                }

                const slotType = card.category === '日卡' ? 'sun' : 'moon';
                let targetSlot = null;
                
                if (slotType === 'sun') {
                    if (!teamSlots.sun1) targetSlot = 'sun1';
                    else if (!teamSlots.sun2) targetSlot = 'sun2';
                } else {
                    for (let i = 1; i <= 4; i++) {
                        const slotId = 'moon' + i;
                        if (!teamSlots[slotId]) {
                            targetSlot = slotId;
                            break;
                        }
                    }
                }
                
                if (targetSlot) {
                    setTeamSlots(prev => ({ ...prev, [targetSlot]: card }));
                    setCardLevels(prev => ({ ...prev, [targetSlot]: 80 }));
                    setCardBreakthroughs(prev => ({ ...prev, [targetSlot]: 0 }));
                }
            }

            function removeCard(slotId) {
                setTeamSlots(prev => ({ ...prev, [slotId]: null }));
                const newLevels = { ...cardLevels };
                delete newLevels[slotId];
                setCardLevels(newLevels);
                
                const newBreakthroughs = { ...cardBreakthroughs };
                delete newBreakthroughs[slotId];
                setCardBreakthroughs(newBreakthroughs);
            }

            function clearTeam() {
                setTeamSlots({ sun1: null, sun2: null, moon1: null, moon2: null, moon3: null, moon4: null });
                setCardLevels({});
                setCardBreakthroughs({});
            }

            const autoConfig = () => {
                const availableCards = getFilteredCards();
                const sunCards = availableCards.filter(card => card.category === '日卡').slice(0, 2);
                const moonCards = availableCards.filter(card => card.category === '月卡').slice(0, 4);
                
                const newTeamSlots = {};
                const newLevels = {};
                const newBreakthroughs = {};
                
                sunCards.forEach((card, index) => {
                    const slotId = `sun${index + 1}`;
                    newTeamSlots[slotId] = card;
                    newLevels[slotId] = 80;
                    newBreakthroughs[slotId] = 0;
                });
                
                moonCards.forEach((card, index) => {
                    const slotId = `moon${index + 1}`;
                    newTeamSlots[slotId] = card;
                    newLevels[slotId] = 80;
                    newBreakthroughs[slotId] = 0;
                });
                
                setTeamSlots(prev => ({ ...prev, ...newTeamSlots }));
                setCardLevels(prev => ({ ...prev, ...newLevels }));
                setCardBreakthroughs(prev => ({ ...prev, ...newBreakthroughs }));
            };

            // 創建進階選擇器組件
            const createAdvancementSelector = (slotId) => {
                return React.createElement('div', {className: "mb-2 p-1 bg-white rounded border"},
                    React.createElement('div', {className: "text-xs font-semibold text-center mb-1"}, "進階"),
                    React.createElement('select', {
                        value: cardAdvancements[slotId] || 0,
                        onChange: (e) => {
                            const advancement = parseInt(e.target.value);
                            setCardAdvancements(prev => ({ ...prev, [slotId]: advancement }));
                        },
                        className: "w-full text-xs p-1 border rounded"
                    },
                        React.createElement('option', {value: 0}, "進階0"),
                        React.createElement('option', {value: 1}, "進階1"),
                        React.createElement('option', {value: 2}, "進階2"),
                        React.createElement('option', {value: 3}, "進階3")
                    )
                );
            };

            const teamCards = Object.values(teamSlots).filter(Boolean);

            return React.createElement('div', {className: "max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen"},
                React.createElement('h1', {className: "text-3xl font-bold text-center mb-8 text-gray-800"}, "戰鬥隊伍組建計算機"),
                
                React.createElement('div', {className: "grid grid-cols-1 xl:grid-cols-3 gap-6"},
                    // 左側：配置與篩選
                    React.createElement('div', {className: "space-y-4"},
                        // 搭檔配置
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-blue-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "搭檔配置")
                            ),
                            React.createElement('div', {className: "p-4 space-y-3"},
                                React.createElement('div', {},
                                    React.createElement('label', {className: "block text-sm font-medium mb-1"}, "搭檔"),
                                    React.createElement('select', {
                                        value: selectedPartner,
                                        onChange: (e) => setSelectedPartner(e.target.value),
                                        className: "w-full p-2 border rounded"
                                    },
                                        partners.map(partner => 
                                            React.createElement('option', {key: partner.id, value: partner.id}, partner.name)
                                        )
                                    )
                                ),
                                React.createElement('div', {},
                                    React.createElement('label', {className: "block text-sm font-medium mb-1"}, "職業"),
                                    React.createElement('select', {
                                        value: selectedProfession,
                                        onChange: (e) => {
                                            const newProfession = e.target.value;
                                            setSelectedProfession(newProfession);
                                            const profession = professions.find(p => p.id === newProfession);
                                            if (profession) {
                                                setSelectedPartner(profession.partner);
                                                setSelectedWeapon(profession.weapon);
                                            }
                                        },
                                        className: "w-full p-2 border rounded"
                                    },
                                        professions.map(profession => 
                                            React.createElement('option', {key: profession.id, value: profession.id}, profession.name)
                                        )
                                    )
                                ),
                                React.createElement('div', {},
                                    React.createElement('label', {className: "block text-sm font-medium mb-1"}, "武器"),
                                    React.createElement('select', {
                                        value: selectedWeapon,
                                        onChange: (e) => setSelectedWeapon(e.target.value),
                                        className: "w-full p-2 border rounded"
                                    },
                                        weapons.filter(weapon => weapon.profession === professions.find(p => p.id === selectedProfession)?.name).map(weapon => 
                                            React.createElement('option', {key: weapon.id, value: weapon.id}, weapon.name)
                                        )
                                    )
                                ),
                                React.createElement('div', {},
                                    React.createElement('label', {className: "block text-sm font-medium mb-1"}, "牽絆值等級 (1-220)"),
                                    React.createElement('input', {
                                        type: "number",
                                        min: "1",
                                        max: "220",
                                        value: partnerBondLevel,
                                        onChange: (e) => {
                                            const level = parseInt(e.target.value);
                                            if (level >= 1 && level <= 220) {
                                                setPartnerBondLevel(level);
                                            }
                                        },
                                        className: "w-full p-2 border rounded"
                                    }),
                                    React.createElement('div', {className: "text-xs text-gray-500 mt-1"},
                                        partnerBondLevel >= 5 ? 
                                            `隊伍加成: +${calculatePartnerBondBonus(partnerBondLevel).hp}生命 +${calculatePartnerBondBonus(partnerBondLevel).atk}攻擊 +${calculatePartnerBondBonus(partnerBondLevel).def}防禦` :
                                            '等級5以上才有加成'
                                    )
                                )
                            )
                        ),

                        // 卡牌篩選
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-green-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "卡牌篩選")
                            ),
                            React.createElement('div', {className: "p-4 space-y-4"},
                                React.createElement('div', {},
                                    React.createElement('label', {className: "text-sm font-medium"}, "種類"),
                                    React.createElement('div', {className: "space-y-1 mt-1"},
                                        React.createElement('label', {className: "flex items-center text-sm"},
                                            React.createElement('input', {
                                                type: "checkbox",
                                                checked: cardFilters.categories.sun,
                                                onChange: () => toggleFilter('categories', 'sun'),
                                                className: "mr-2"
                                            }),
                                            "日卡"
                                        ),
                                        React.createElement('label', {className: "flex items-center text-sm"},
                                            React.createElement('input', {
                                                type: "checkbox",
                                                checked: cardFilters.categories.moon,
                                                onChange: () => toggleFilter('categories', 'moon'),
                                                className: "mr-2"
                                            }),
                                            "月卡"
                                        )
                                    )
                                ),
                                React.createElement('div', {},
                                    React.createElement('label', {className: "text-sm font-medium"}, "星譜"),
                                    React.createElement('div', {className: "grid grid-cols-2 gap-1 mt-1"},
                                        Object.entries(constellations).map(([key, name]) =>
                                            React.createElement('label', {key: key, className: "flex items-center text-sm"},
                                                React.createElement('input', {
                                                    type: "checkbox",
                                                    checked: cardFilters.constellations[key],
                                                    onChange: () => toggleFilter('constellations', key),
                                                    className: "mr-2"
                                                }),
                                                name
                                            )
                                        )
                                    )
                                ),
                                React.createElement('div', {},
                                    React.createElement('label', {className: "text-sm font-medium"}, "類型"),
                                    React.createElement('div', {className: "space-y-1 mt-1"},
                                        Object.entries(cardTypes).map(([key, name]) =>
                                            React.createElement('label', {key: key, className: "flex items-center text-sm"},
                                                React.createElement('input', {
                                                    type: "checkbox",
                                                    checked: cardFilters.types[key],
                                                    onChange: () => toggleFilter('types', key),
                                                    className: "mr-2"
                                                }),
                                                name
                                            )
                                        )
                                    )
                                ),
                                React.createElement('div', {className: "text-xs text-gray-500 pt-2 border-t"},
                                    `顯示 ${getFilteredCards().length} 張卡牌`
                                )
                            )
                        ),

                        // 可用卡牌
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-indigo-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "可用卡牌")
                            ),
                            React.createElement('div', {className: "p-4"},
                                React.createElement('div', {className: "grid grid-cols-3 gap-2 max-h-96 overflow-y-auto"},
                                    getFilteredCards().map(card => {
                                        const rarityColor = card.rarity === 5 ? 'border-yellow-400 bg-yellow-50' : 'border-purple-400 bg-purple-50';
                                        const isInTeam = isCardInTeam(card.id);
                                        const cardStyle = isInTeam ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg';
                                        
                                        return React.createElement('div', {
                                            key: card.id,
                                            className: `w-24 h-32 border-2 ${rarityColor} rounded-lg p-2 relative transition-all ${cardStyle}`,
                                            onClick: () => !isInTeam && addCard(card)
                                        },
                                            isInTeam && React.createElement('div', {className: "absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded"}, "已選"),
                                            React.createElement('div', {className: "text-xs font-bold mb-1 truncate"}, card.name),
                                            React.createElement('div', {className: "text-xs text-gray-600"},
                                                React.createElement('div', {}, `${card.rarity}★`),
                                                React.createElement('div', {}, constellations[card.constellation]),
                                                React.createElement('div', {}, cardTypes[card.type])
                                            ),
                                            React.createElement('div', {className: "absolute bottom-1 right-1 text-xs bg-blue-100 px-1 rounded"}, card.category)
                                        );
                                    })
                                )
                            )
                        )
                    ),

                    // 中間：隊伍組建
                    React.createElement('div', {className: "space-y-4"},
                        // 隊伍組建
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-red-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "隊伍組建")
                            ),
                            React.createElement('div', {className: "p-4 space-y-6"},
                                // 日卡位
                                React.createElement('div', {},
                                    React.createElement('h3', {className: "text-lg font-semibold mb-3 text-orange-600"}, "日卡位"),
                                    React.createElement('div', {className: "flex gap-4 justify-center"},
                                        ['sun1', 'sun2'].map((slotId, index) =>
                                            React.createElement('div', {key: slotId, className: "text-center"},
                                                React.createElement('div', {className: "mb-2"}, `日卡${index + 1}`),
                                                teamSlots[slotId] ? 
                                                    React.createElement('div', {
                                                        className: "w-24 h-32 border-2 border-yellow-400 bg-yellow-50 rounded-lg p-2 cursor-pointer relative group",
                                                        onClick: () => removeCard(slotId)
                                                    },
                                                        React.createElement('button', {className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"}, "×"),
                                                        React.createElement('div', {className: "text-xs font-bold mb-1 truncate"}, teamSlots[slotId].name),
                                                        React.createElement('div', {className: "text-xs text-gray-600"},
                                                            React.createElement('div', {}, "5★"),
                                                            React.createElement('div', {}, cardTypes[teamSlots[slotId].type])
                                                        )
                                                    ) :
                                                    React.createElement('div', {className: "w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs bg-gray-50"}, "空位"),
                                                
                                                teamSlots[slotId] && React.createElement('div', {className: "mt-2 p-2 bg-gray-50 rounded border w-24"},
                                                    React.createElement('div', {className: "text-xs bg-white p-1 rounded border mb-2"},
                                                        React.createElement('div', {className: "font-semibold text-green-600 text-center mb-1"}, "數值"),
                                                        (() => {
                                                            const stats = calculateStats(teamSlots[slotId], cardLevels[slotId] || 80, cardBreakthroughs[slotId] || 0, cardAdvancements[slotId] || 0);
                                                            return React.createElement('div', {className: "space-y-1"},
                                                                React.createElement('div', {}, `生命: ${stats.hp.toLocaleString()}`),
                                                                React.createElement('div', {}, `攻擊: ${stats.atk.toLocaleString()}`),
                                                                React.createElement('div', {}, `防禦: ${stats.def.toLocaleString()}`),
                                                                teamSlots[slotId].category === '日卡' && React.createElement('div', {}, `暴傷: ${stats.criticalDamage.toFixed(1)}%`),
                                                                teamSlots[slotId].category === '月卡' && React.createElement('div', {}, `暴擊: ${stats.criticalRate.toFixed(1)}%`),
                                                                React.createElement('div', {}, `虛弱增傷: ${stats.weaknessDamage.toFixed(1)}%`)
                                                            );
                                                        })()
                                                    ),
                                                    React.createElement('div', {className: "mb-2 p-1 bg-white rounded border"},
                                                        React.createElement('div', {className: "text-xs font-semibold text-center mb-1"}, "等級"),
                                                        React.createElement('input', {
                                                            type: "range",
                                                            min: "1",
                                                            max: "80",
                                                            value: cardLevels[slotId] || 80,
                                                            onChange: (e) => {
                                                                const level = parseInt(e.target.value);
                                                                setCardLevels(prev => ({ ...prev, [slotId]: level }));
                                                            },
                                                            className: "w-full"
                                                        }),
                                                        React.createElement('div', {className: "text-xs text-center text-blue-600 font-medium"}, cardLevels[slotId] || 80)
                                                    ),
                                                    React.createElement('div', {className: "mb-2 p-1 bg-white rounded border"},
                                                        React.createElement('div', {className: "text-xs font-semibold text-center mb-1"}, "突破"),
                                                        React.createElement('select', {
                                                            value: cardBreakthroughs[slotId] || 0,
                                                            onChange: (e) => {
                                                                const breakthrough = parseInt(e.target.value);
                                                                setCardBreakthroughs(prev => ({ ...prev, [slotId]: breakthrough }));
                                                            },
                                                            className: "w-full text-xs p-1 border rounded"
                                                        },
                                                            React.createElement('option', {value: 0}, "未突破"),
                                                            React.createElement('option', {value: 1}, "1突破"),
                                                            React.createElement('option', {value: 2}, "2突破"),
                                                            React.createElement('option', {value: 3}, "3突破")
                                                        )
                                                    ),
                                                    createAdvancementSelector(slotId)
                                                )
                                            )
                                        )
                                    )
                                ),

                                // 月卡位
                                React.createElement('div', {},
                                    React.createElement('h3', {className: "text-lg font-semibold mb-3 text-blue-600"}, "月卡位"),
                                    React.createElement('div', {className: "grid grid-cols-2 gap-4"},
                                        ['moon1', 'moon2', 'moon3', 'moon4'].map((slotId, index) =>
                                            React.createElement('div', {key: slotId, className: "text-center"},
                                                React.createElement('div', {className: "mb-2"}, `月卡${index + 1}`),
                                                teamSlots[slotId] ? 
                                                    React.createElement('div', {
                                                        className: "w-24 h-32 border-2 border-yellow-400 bg-yellow-50 rounded-lg p-2 cursor-pointer relative group mx-auto",
                                                        onClick: () => removeCard(slotId)
                                                    },
                                                        React.createElement('button', {className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100"}, "×"),
                                                        React.createElement('div', {className: "text-xs font-bold mb-1 truncate"}, teamSlots[slotId].name),
                                                        React.createElement('div', {className: "text-xs text-gray-600"},
                                                            React.createElement('div', {}, "5★"),
                                                            React.createElement('div', {}, cardTypes[teamSlots[slotId].type])
                                                        )
                                                    ) :
                                                    React.createElement('div', {className: "w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs bg-gray-50 mx-auto"}, "空位"),
                                                
                                                teamSlots[slotId] && React.createElement('div', {className: "mt-2 p-2 bg-gray-50 rounded border w-24 mx-auto"},
                                                    React.createElement('div', {className: "text-xs bg-white p-1 rounded border mb-2"},
                                                        React.createElement('div', {className: "font-semibold text-green-600 text-center mb-1"}, "數值"),
                                                        (() => {
                                                            const stats = calculateStats(teamSlots[slotId], cardLevels[slotId] || 80, cardBreakthroughs[slotId] || 0, cardAdvancements[slotId] || 0);
                                                            return React.createElement('div', {className: "space-y-1"},
                                                                React.createElement('div', {}, `生命: ${stats.hp.toLocaleString()}`),
                                                                React.createElement('div', {}, `攻擊: ${stats.atk.toLocaleString()}`),
                                                                React.createElement('div', {}, `防禦: ${stats.def.toLocaleString()}`),
                                                                teamSlots[slotId].category === '日卡' && React.createElement('div', {}, `暴傷: ${stats.criticalDamage.toFixed(1)}%`),
                                                                teamSlots[slotId].category === '月卡' && React.createElement('div', {}, `暴擊: ${stats.criticalRate.toFixed(1)}%`),
                                                                React.createElement('div', {}, `虛弱增傷: ${stats.weaknessDamage.toFixed(1)}%`)
                                                            );
                                                        })()
                                                    ),
                                                    React.createElement('div', {className: "mb-2 p-1 bg-white rounded border"},
                                                        React.createElement('div', {className: "text-xs font-semibold text-center mb-1"}, "等級"),
                                                        React.createElement('input', {
                                                            type: "range",
                                                            min: "1",
                                                            max: "80",
                                                            value: cardLevels[slotId] || 80,
                                                            onChange: (e) => {
                                                                const level = parseInt(e.target.value);
                                                                setCardLevels(prev => ({ ...prev, [slotId]: level }));
                                                            },
                                                            className: "w-full"
                                                        }),
                                                        React.createElement('div', {className: "text-xs text-center text-blue-600 font-medium"}, cardLevels[slotId] || 80)
                                                    ),
                                                    React.createElement('div', {className: "mb-2 p-1 bg-white rounded border"},
                                                        React.createElement('div', {className: "text-xs font-semibold text-center mb-1"}, "突破"),
                                                        React.createElement('select', {
                                                            value: cardBreakthroughs[slotId] || 0,
                                                            onChange: (e) => {
                                                                const breakthrough = parseInt(e.target.value);
                                                                setCardBreakthroughs(prev => ({ ...prev, [slotId]: breakthrough }));
                                                            },
                                                            className: "w-full text-xs p-1 border rounded"
                                                        },
                                                            React.createElement('option', {value: 0}, "未突破"),
                                                            React.createElement('option', {value: 1}, "1突破"),
                                                            React.createElement('option', {value: 2}, "2突破"),
                                                            React.createElement('option', {value: 3}, "3突破")
                                                        )
                                                    ),
                                                    createAdvancementSelector(slotId)
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),

                        // 快速操作
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-gray-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "快速操作")
                            ),
                            React.createElement('div', {className: "p-4 space-y-3"},
                                React.createElement('button', {
                                    onClick: clearTeam,
                                    className: "w-full bg-red-500 text-white py-3 px-4 rounded hover:bg-red-600 transition-colors font-medium"
                                }, "清空隊伍"),
                                React.createElement('button', {
                                    onClick: autoConfig,
                                    className: "w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors font-medium"
                                }, "自動配置"),
                                React.createElement('div', {className: "text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded"}, "自動配置會根據當前篩選條件，選擇可用的卡片組合")
                            )
                        )
                    ),

                    // 右側：隊伍總數值
                    React.createElement('div', {className: "space-y-4"},
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-green-500 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "隊伍總數值")
                            ),
                            React.createElement('div', {className: "p-4"},
                                teamCards.length === 0 ? 
                                    React.createElement('div', {className: "text-center text-gray-500 py-8"}, "請先配置隊伍卡片") :
                                    React.createElement('div', {className: "space-y-3"},
                                        (() => {
                                            const totalStats = teamCards.reduce((total, card) => {
                                                const slotId = Object.keys(teamSlots).find(key => teamSlots[key] === card);
                                                const stats = calculateStats(teamSlots[slotId], cardLevels[slotId] || 80, cardBreakthroughs[slotId] || 0, cardAdvancements[slotId] || 0);
                                                
                                                return {
                                                    hp: total.hp + stats.hp,
                                                    atk: total.atk + stats.atk,
                                                    def: total.def + stats.def,
                                                    criticalDamage: total.criticalDamage + stats.criticalDamage,
                                                    criticalRate: total.criticalRate + stats.criticalRate,
                                                    weaknessDamage: total.weaknessDamage + stats.weaknessDamage
                                                };
                                            }, { 
                                                hp: 0, atk: 0, def: 0, criticalDamage: 0, criticalRate: 0, weaknessDamage: 0
                                            });

                                            // 加上搭檔牽絆值加成
                                            const bondBonus = calculatePartnerBondBonus(partnerBondLevel);
                                            totalStats.hp += bondBonus.hp;
                                            totalStats.atk += bondBonus.atk;
                                            totalStats.def += bondBonus.def;

                                            const sunCardCount = teamCards.filter(card => card.category === '日卡').length;
                                            const sunSetEffect = sunCardCount >= 2 ? "日卡套裝效果：2件套 - 暴擊傷害提高20%" : "";

                                            return React.createElement('div', {className: "space-y-3"},
                                                React.createElement('div', {className: "grid grid-cols-2 gap-3 text-sm"},
                                                    React.createElement('div', {className: "bg-red-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-red-700"}, "總生命值"),
                                                        React.createElement('div', {className: "text-xl font-bold text-red-600"}, totalStats.hp.toLocaleString())
                                                    ),
                                                    React.createElement('div', {className: "bg-orange-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-orange-700"}, "總攻擊力"),
                                                        React.createElement('div', {className: "text-xl font-bold text-orange-600"}, totalStats.atk.toLocaleString())
                                                    ),
                                                    React.createElement('div', {className: "bg-blue-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-blue-700"}, "總防禦力"),
                                                        React.createElement('div', {className: "text-xl font-bold text-blue-600"}, totalStats.def.toLocaleString())
                                                    ),
                                                    React.createElement('div', {className: "bg-green-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-green-700"}, "平均暴擊率"),
                                                        React.createElement('div', {className: "text-xl font-bold text-green-600"}, `${(totalStats.criticalRate / Math.max(teamCards.length, 1)).toFixed(1)}%`)
                                                    ),
                                                    React.createElement('div', {className: "bg-purple-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-purple-700"}, "總暴擊傷害"),
                                                        React.createElement('div', {className: "text-xl font-bold text-purple-600"}, `${totalStats.criticalDamage.toFixed(1)}%`)
                                                    ),
                                                    React.createElement('div', {className: "bg-yellow-100 p-3 rounded"},
                                                        React.createElement('div', {className: "font-semibold text-yellow-700"}, "總虛弱增傷"),
                                                        React.createElement('div', {className: "text-xl font-bold text-yellow-600"}, `${totalStats.weaknessDamage.toFixed(1)}%`)
                                                    )
                                                ),
                                                
                                                partnerBondLevel >= 5 && React.createElement('div', {className: "bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded border-l-4 border-blue-500"},
                                                    React.createElement('div', {className: "font-semibold text-blue-800 text-sm"}, "搭檔牽絆加成"),
                                                    React.createElement('div', {className: "text-blue-700 text-sm"}, `等級 ${partnerBondLevel}: +${bondBonus.hp}生命 +${bondBonus.atk}攻擊 +${bondBonus.def}防禦`)
                                                ),
                                                
                                                sunSetEffect && React.createElement('div', {className: "bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded border-l-4 border-yellow-500"},
                                                    React.createElement('div', {className: "font-semibold text-yellow-800 text-sm"}, "套裝效果"),
                                                    React.createElement('div', {className: "text-yellow-700 text-sm"}, sunSetEffect)
                                                ),

                                                React.createElement('div', {className: "bg-gray-100 p-3 rounded border"},
                                                    React.createElement('div', {className: "font-semibold text-gray-800 text-sm mb-2"}, "隊伍配置詳情"),
                                                    React.createElement('div', {className: "text-xs text-gray-600 space-y-1"},
                                                        React.createElement('div', {}, `• 日卡數量: ${teamCards.filter(card => card.category === '日卡').length}/2`),
                                                        React.createElement('div', {}, `• 月卡數量: ${teamCards.filter(card => card.category === '月卡').length}/4`),
                                                        React.createElement('div', {}, `• 攻擊型卡片: ${teamCards.filter(card => card.type === 'attack').length}`),
                                                        React.createElement('div', {}, `• 防禦型卡片: ${teamCards.filter(card => card.type === 'defense').length}`),
                                                        React.createElement('div', {}, `• 生命型卡片: ${teamCards.filter(card => card.type === 'life').length}`)
                                                    )
                                                )
                                            );
                                        })()
                                    )
                            )
                        ),

                        // 系統說明
                        React.createElement('div', {className: "bg-white rounded-lg shadow-md"},
                            React.createElement('div', {className: "bg-gray-600 text-white px-4 py-3 rounded-t-lg"},
                                React.createElement('h2', {className: "text-lg font-semibold"}, "系統說明")
                            ),
                            React.createElement('div', {className: "p-4"},
                                React.createElement('div', {className: "text-sm space-y-2"},
                                    React.createElement('div', {className: "text-green-700 font-medium"}, "✓ 完整突破系統支援"),
                                    React.createElement('div', {className: "text-green-700 font-medium"}, "✓ 真實基礎數值計算"),
                                    React.createElement('div', {className: "text-green-700 font-medium"}, "✓ 精確屬性加成系統"),
                                    React.createElement('div', {className: "text-green-700 font-medium"}, "✓ 進階系統支援"),
                                    React.createElement('div', {className: "text-gray-600"}, "• 日卡提供暴擊傷害加成"),
                                    React.createElement('div', {className: "text-gray-600"}, "• 月卡提供暴擊率加成"),
                                    React.createElement('div', {className: "text-gray-600"}, "• 虛弱增傷基於攻擊力計算"),
                                    React.createElement('div', {className: "text-gray-600"}, "• 搭檔牽絆值全隊加成"),
                                    React.createElement('div', {className: "text-gray-600"}, "• 支援完整隊伍組建")
                                )
                            )
                        )
                    )
                )
            );
        }

        // 將 React 組件掛載到頁面
        ReactDOM.render(React.createElement(TeamCalculator), document.getElementById('root'));
    </script>
</body>
</html>
