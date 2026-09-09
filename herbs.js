// A compact, classroom-oriented corpus. The schema is intentionally flat so it can be
// replaced by a licensed materia medica source without changing the UI.
const categorySeeds = [
  ['解表药', ['麻黄','桂枝','紫苏叶','生姜','香薷','荆芥','防风','羌活','白芷','细辛','藁本','苍耳子','辛夷','薄荷','牛蒡子','蝉蜕','桑叶','菊花','柴胡','升麻','葛根','蔓荆子']],
  ['清热药', ['石膏','知母','栀子','夏枯草','决明子','黄芩','黄连','黄柏','龙胆','苦参','金银花','连翘','板蓝根','大青叶','鱼腥草','蒲公英','紫花地丁','穿心莲','败酱草','白头翁','射干','马勃','青黛','地骨皮','牡丹皮','赤芍','玄参','生地黄','大血藤','土茯苓']],
  ['泻下药', ['大黄','芒硝','番泻叶','火麻仁','郁李仁','甘遂','京大戟','红大戟','芫花','牵牛子','巴豆','芦荟']],
  ['祛风湿药', ['独活','威灵仙','秦艽','防己','木瓜','蚕沙','豨莶草','臭梧桐','络石藤','海风藤','雷公藤','桑寄生','五加皮','狗脊','千年健','伸筋草','透骨草','松节']],
  ['化湿药', ['藿香','佩兰','苍术','厚朴','砂仁','白豆蔻','草豆蔻','草果','茯苓','薏苡仁']],
  ['利水渗湿药', ['猪苓','泽泻','车前子','车前草','滑石','木通','通草','瞿麦','萹蓄','地肤子','海金沙','石韦','金钱草','虎杖','茵陈','灯心草','冬瓜皮','玉米须']],
  ['温里药', ['附子','干姜','肉桂','吴茱萸','小茴香','丁香','高良姜','花椒','胡椒','荜茇','荜澄茄']],
  ['理气药', ['陈皮','青皮','枳实','枳壳','木香','沉香','檀香','川楝子','乌药','香附','佛手','香橼','薤白','大腹皮','柿蒂','刀豆','甘松','九香虫']],
  ['消食药', ['山楂','神曲','麦芽','谷芽','莱菔子','鸡内金','鸡矢藤','隔山消','阿魏']],
  ['驱虫药', ['使君子','苦楝皮','槟榔','南瓜子','鹤草芽','雷丸','榧子','芜荑']],
  ['止血药', ['小蓟','大蓟','地榆','槐花','侧柏叶','白茅根','苎麻根','三七','茜草','蒲黄','仙鹤草','白及','艾叶','炮姜','棕榈炭','血余炭']],
  ['活血化瘀药', ['川芎','延胡索','郁金','姜黄','乳香','没药','丹参','红花','桃仁','益母草','泽兰','牛膝','鸡血藤','水蛭','虻虫','土鳖虫','穿山甲','五灵脂','三棱','莪术','凌霄花','月季花','王不留行','自然铜']],
  ['化痰止咳平喘药', ['半夏','天南星','白附子','白芥子','皂荚','旋覆花','白前','桔梗','前胡','川贝母','浙贝母','瓜蒌','竹茹','竹沥','天竺黄','海藻','昆布','胖大海','苦杏仁','紫苏子','百部','桑白皮','葶苈子','苏木']],
  ['安神药', ['朱砂','磁石','龙骨','琥珀','酸枣仁','柏子仁','远志','合欢皮','夜交藤','灵芝','珍珠母']],
  ['平肝息风药', ['石决明','牡蛎','代赭石','珍珠','羚羊角','钩藤','天麻','地龙','全蝎','蜈蚣','僵蚕','罗布麻叶']],
  ['开窍药', ['麝香','冰片','苏合香','石菖蒲','远志']],
  ['补虚药', ['人参','党参','黄芪','白术','山药','甘草','西洋参','太子参','扁豆','大枣','鹿茸','淫羊藿','巴戟天','补骨脂','益智仁','肉苁蓉','杜仲','续断','菟丝子','沙苑子','女贞子','旱莲草','枸杞子','桑椹','墨旱莲','当归','熟地黄','白芍','阿胶','何首乌','麦冬','天冬','玉竹','石斛','百合','枣仁','龟甲','鳖甲','蛤蚧','冬虫夏草']],
  ['收涩药', ['五味子','乌梅','五倍子','诃子','肉豆蔻','赤石脂','莲子','芡实','覆盆子','桑螵蛸','海螵蛸','金樱子']],
  ['涌吐药', ['常山','瓜蒂','胆矾']],
  ['攻毒杀虫止痒药', ['雄黄','硫黄','白矾','蛇床子','土荆皮','大蒜','露蜂房','蜂房']],
  ['拔毒化腐生肌药', ['升药','轻粉','砒石','炉甘石','硼砂']],
  ['芳香化湿与茶饮', ['荷叶','莲子心','玫瑰花','菊花茶','决明子茶','桑叶茶','山楂叶','桂花','茉莉花','陈皮丝']],
];

const detailMap = {
  '麻黄': {pinyin:'má huáng', nature:'温', taste:'辛、微苦', channels:'肺、膀胱经', efficacy:'发汗解表，宣肺平喘，利水消肿', indications:'风寒表实证、胸闷喘咳、风水浮肿', part:'草质茎', origin:'内蒙古、河北、山西', caution:'表虚自汗、阴虚盗汗及肺肾虚喘者慎用'},
  '紫苏叶': {pinyin:'zǐ sū yè', nature:'温', taste:'辛', channels:'肺、脾经', efficacy:'解表散寒，行气和胃', indications:'风寒感冒、咳嗽呕恶、脾胃气滞、妊娠呕吐', part:'叶或带嫩枝', origin:'江苏、浙江、河北', caution:'温病及气弱表虚者慎用'},
  '生姜': {pinyin:'shēng jiāng', nature:'微温', taste:'辛', channels:'肺、脾、胃经', efficacy:'解表散寒，温中止呕，化痰止咳，解鱼蟹毒', indications:'风寒感冒、脾胃寒证、胃寒呕吐、肺寒咳嗽', part:'新鲜根茎', origin:'全国多地', caution:'阴虚内热及实热证慎用'},
  '荆芥': {pinyin:'jīng jiè', nature:'微温', taste:'辛', channels:'肺、肝经', efficacy:'解表散风，透疹，消疮；炒炭止血', indications:'感冒、头痛、麻疹不透、风疹瘙痒、疮疡初起', part:'地上部分', origin:'江苏、浙江、江西', caution:'表虚自汗、阴虚头痛者慎用'},
  '防风': {pinyin:'fáng fēng', nature:'微温', taste:'辛、甘', channels:'膀胱、肝、脾经', efficacy:'祛风解表，胜湿止痛，止痉', indications:'外感表证、风疹瘙痒、风湿痹痛、破伤风', part:'根', origin:'黑龙江、吉林、内蒙古', caution:'血虚发痉及阴虚火旺者慎用'},
  '薄荷': {pinyin:'bò he', nature:'凉', taste:'辛', channels:'肺、肝经', efficacy:'疏散风热，清利头目，利咽透疹，疏肝行气', indications:'风热感冒、头痛目赤、咽喉肿痛、麻疹不透、肝郁气滞', part:'地上部分', origin:'江苏、安徽', caution:'体虚多汗者慎用；煎服宜后下'},
  '人参': {pinyin:'rén shēn', nature:'微温', taste:'甘、微苦', channels:'脾、肺、心、肾经', efficacy:'大补元气，复脉固脱，补脾益肺，生津养血，安神益智', indications:'气虚欲脱、脾气不足、肺气亏虚、津伤口渴、心神不安', part:'根', origin:'吉林、辽宁、黑龙江', caution:'实证、热证而正气不虚者忌服；不宜与藜芦同用'},
  '黄芪': {pinyin:'huáng qí', nature:'微温', taste:'甘', channels:'脾、肺经', efficacy:'补气升阳，固表止汗，利水消肿，生津养血，托毒排脓', indications:'气虚乏力、食少便溏、中气下陷、表虚自汗、气虚水肿', part:'根', origin:'内蒙古、山西、甘肃', caution:'表实邪盛、气滞湿阻、食积内停者慎用'},
  '甘草': {pinyin:'gān cǎo', nature:'平', taste:'甘', channels:'心、肺、脾、胃经', efficacy:'补脾益气，清热解毒，止咳祛痰，缓急止痛，调和诸药', indications:'脾胃虚弱、倦怠乏力、咳嗽痰多、脘腹疼痛、药食中毒', part:'根及根茎', origin:'内蒙古、甘肃、新疆', caution:'不宜与海藻、京大戟、红大戟、甘遂、芫花同用；水肿者慎用'},
  '当归': {pinyin:'dāng guī', nature:'温', taste:'甘、辛', channels:'肝、心、脾经', efficacy:'补血活血，调经止痛，润肠通便', indications:'血虚萎黄、月经不调、经闭痛经、虚寒腹痛、肠燥便秘', part:'根', origin:'甘肃', caution:'湿盛中满、大便溏泄者慎用'},
  '川芎': {pinyin:'chuān xiōng', nature:'温', taste:'辛', channels:'肝、胆、心包经', efficacy:'活血行气，祛风止痛', indications:'胸痹心痛、胁肋刺痛、月经不调、经闭痛经、头痛眩晕', part:'根茎', origin:'四川', caution:'阴虚火旺、上盛下虚者慎用'},
  '白术': {pinyin:'bái zhú', nature:'温', taste:'苦、甘', channels:'脾、胃经', efficacy:'健脾益气，燥湿利水，止汗，安胎', indications:'脾气虚弱、食少便溏、痰饮水肿、表虚自汗、胎动不安', part:'根茎', origin:'浙江、湖北', caution:'阴虚内热、津液亏耗者慎用'},
  '茯苓': {pinyin:'fú líng', nature:'平', taste:'甘、淡', channels:'心、肺、脾、肾经', efficacy:'利水渗湿，健脾，宁心', indications:'水肿尿少、痰饮眩悸、脾虚食少、心神不安', part:'菌核', origin:'云南、安徽', caution:'虚寒精滑者慎用'},
  '桂枝': {pinyin:'guì zhī', nature:'温', taste:'辛、甘', channels:'心、肺、膀胱经', efficacy:'发汗解肌，温通经脉，助阳化气，平冲降逆', indications:'风寒感冒、脘腹冷痛、血寒经闭、关节痹痛、水肿', part:'嫩枝', origin:'广西、广东', caution:'温热病、阴虚火旺、孕妇慎用'},
  '柴胡': {pinyin:'chái hú', nature:'微寒', taste:'辛、苦', channels:'肝、胆、肺经', efficacy:'疏散退热，疏肝解郁，升举阳气', indications:'感冒发热、寒热往来、肝郁气滞、胸胁胀痛、气虚下陷', part:'根', origin:'陕西、甘肃', caution:'肝阳上亢、阴虚火旺者慎用'},
  '黄连': {pinyin:'huáng lián', nature:'寒', taste:'苦', channels:'心、脾、胃、肝、胆、大肠经', efficacy:'清热燥湿，泻火解毒', indications:'湿热痞满、呕吐吞酸、心火亢盛、高热神昏、目赤牙痛', part:'根茎', origin:'四川、湖北', caution:'脾胃虚寒、阴虚津伤者慎用'},
  '金银花': {pinyin:'jīn yín huā', nature:'寒', taste:'甘', channels:'肺、心、胃经', efficacy:'清热解毒，疏散风热', indications:'痈肿疔疮、喉痹、丹毒、风热感冒、温病发热', part:'花蕾或初开的花', origin:'河南、山东', caution:'脾胃虚寒及气虚疮疡脓清者慎用'},
  '大黄': {pinyin:'dà huáng', nature:'寒', taste:'苦', channels:'脾、胃、大肠、肝、心包经', efficacy:'泻下攻积，清热泻火，凉血解毒，逐瘀通经', indications:'实热积滞便秘、血热吐衄、目赤咽肿、瘀血经闭', part:'根及根茎', origin:'四川、甘肃', caution:'孕妇、月经期、哺乳期慎用；脾胃虚弱者忌用'},
  '陈皮': {pinyin:'chén pí', nature:'温', taste:'苦、辛', channels:'肺、脾经', efficacy:'理气健脾，燥湿化痰', indications:'脘腹胀满、食少吐泻、咳嗽痰多', part:'成熟果皮', origin:'广东、福建', caution:'气虚体燥、阴虚燥咳者慎用'},
  '半夏': {pinyin:'bàn xià', nature:'温', taste:'辛', channels:'脾、胃、肺经', efficacy:'燥湿化痰，降逆止呕，消痞散结', indications:'湿痰寒痰、咳喘痰多、呕吐反胃、胸脘痞闷', part:'块茎', origin:'四川、湖北', caution:'生品有毒，须炮制后使用；阴虚燥咳、津伤口渴者慎用'},
  '枸杞子': {pinyin:'gǒu qǐ zǐ', nature:'平', taste:'甘', channels:'肝、肾经', efficacy:'滋补肝肾，益精明目', indications:'肝肾阴虚、腰膝酸软、眩晕耳鸣、内热消渴、目昏不明', part:'成熟果实', origin:'宁夏、甘肃', caution:'脾虚便溏者慎用'},
  '菊花': {pinyin:'jú huā', nature:'微寒', taste:'甘、苦', channels:'肺、肝经', efficacy:'散风清热，平肝明目，清热解毒', indications:'风热感冒、肝阳上亢、目赤昏花、疮痈肿毒', part:'头状花序', origin:'浙江、安徽', caution:'气虚胃寒、食少泄泻者慎用'},
  '天麻': {pinyin:'tiān má', nature:'平', taste:'甘', channels:'肝经', efficacy:'息风止痉，平抑肝阳，祛风通络', indications:'肝风内动、眩晕、癫痫抽搐、肢体麻木、风湿痹痛', part:'块茎', origin:'云南、四川', caution:'血虚无风、气血亏虚者慎用'},
  '丹参': {pinyin:'dān shēn', nature:'微寒', taste:'苦', channels:'心、肝经', efficacy:'活血祛瘀，通经止痛，清心除烦，凉血消痈', indications:'胸痹心痛、脘腹胁痛、月经不调、疮痈肿痛、心烦不眠', part:'根及根茎', origin:'四川、山东', caution:'不宜与藜芦同用；孕妇慎用'},
};

const categoryMeta = {
  '解表药':['解表散寒，宣肺通窍','风寒束表、鼻塞头痛'], '清热药':['清热泻火，凉血解毒','里热证、温毒发斑'], '泻下药':['通便泻热，逐水破积','实热积滞、水饮内停'], '祛风湿药':['祛风除湿，通络止痛','风湿痹痛、筋脉拘挛'], '化湿药':['芳香化湿，醒脾和中','湿阻中焦、脘腹胀满'], '利水渗湿药':['利水消肿，清热除湿','水肿、淋证、黄疸'], '温里药':['温中散寒，回阳通脉','里寒证、脘腹冷痛'], '理气药':['疏肝理气，宽中除胀','气滞胸胁、脘腹胀痛'], '消食药':['消食化积，和胃导滞','食积不化、脘腹胀满'], '驱虫药':['驱虫消积，解毒疗癣','肠道寄生虫、虫积腹痛'], '止血药':['凉血止血，化瘀止血','出血证、瘀血内阻'], '活血化瘀药':['活血行气，祛瘀止痛','瘀血阻滞、经闭痛经'], '化痰止咳平喘药':['燥湿化痰，降气止咳','咳嗽痰多、喘息胸闷'], '安神药':['养心安神，镇惊定志','心神不宁、失眠多梦'], '平肝息风药':['平肝潜阳，息风止痉','眩晕、抽搐、麻木'], '开窍药':['芳香开窍，醒神回苏','闭证神昏、痰蒙心窍'], '补虚药':['补益气血，滋阴助阳','气血阴阳不足'], '收涩药':['收敛固涩，益气生津','久泻、遗精、虚汗'], '涌吐药':['涌吐痰食，截疟','痰涎宿食、疟疾'], '攻毒杀虫止痒药':['攻毒杀虫，祛风止痒','疥癣、湿疹、疮疡'], '拔毒化腐生肌药':['拔毒化腐，生肌敛疮','疮疡溃后、腐肉不脱'], '芳香化湿与茶饮':['清润醒神，调和脾胃','日常调养、轻度不适']
};

const natureCycle = ['平','微寒','温','寒','微温'];
const tasteCycle = ['甘、苦','辛、苦','甘、辛','苦','酸、甘'];
const channelCycle = ['肝、脾经','肺、胃经','心、肾经','脾、胃经','肝、肾经'];
const accentCycle = ['leaf','root','flower','seed','bark'];

function makeHerb(name, category, index) {
  const detail = detailMap[name] || {};
  const meta = categoryMeta[category] || ['调理脏腑，平衡气机','常见证候'];
  const verified = Boolean(detail.efficacy);
  const nature = detail.nature || '待核对';
  return {
    id: `herb-${index + 1}`,
    name, pinyin: detail.pinyin || `${name} · ${['常用药','经典药','要药'][index % 3]}`,
    category, nature, taste: detail.taste || '请查教材',
    channels: detail.channels || '请查教材',
    efficacy: detail.efficacy || meta[0], indications: detail.indications || meta[1],
    part: detail.part || '请查教材',
    origin: detail.origin || '多地',
    caution: detail.caution || '此条目当前仅提供类别记忆线索；精确性味、归经与个药功效请查教材。',
    verified,
    accent: accentCycle[index % accentCycle.length],
    image: `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
  };
}

const herbs = [];
categorySeeds.forEach(([category, names]) => names.forEach(name => herbs.push(makeHerb(name, category, herbs.length))));
// De-duplicate names that appear in two textbook chapters while keeping the corpus in the requested range.
const seen = new Set();
const uniqueHerbs = herbs.filter(herb => !seen.has(herb.name) && seen.add(herb.name));
// Keep the study corpus between 200 and 300 entries even if a source list is extended later.
const HERBS = uniqueHerbs.slice(0, 260);

const categoryOrder = [...new Set(HERBS.map(h => h.category))];
const natureOptions = ['寒','微寒','平','温','微温'];

window.HERBS = HERBS;
window.CATEGORY_ORDER = categoryOrder;
window.NATURE_OPTIONS = natureOptions;
