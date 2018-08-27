/** 语言枚举 */
export const Language = cc.Enum({
    // 中文
    chinese: -1,
    // 英文
    english: -1,
});

/** 当前版本语言 */
export const nowLanguage = Language.chinese;

//游戏结束界面
/** 失败原因 */
export let BombOverStr:string = "触发炸弹,小心!";
export let HPEmptyStr:string = "电量耗尽,注意!";

export const BombOverStrCN:string = "触发炸弹,小心!";
export const HPEmptyStrCN:string = "电量耗尽,注意!";

export const BombOverStrEN:string = "GameOver";
export const HPEmptyStrEN:string = "GameOver";

/** 本局得分 */
export const ScoreStrCN:string = "=本局得分=";
export const ScoreStrEN:string = "=Score=";
/** 分享 */
export const ShareReliveStrCN:string = "分享游戏复活";
export const ShareDoubleStrCN:string = "分享游戏得分X2";
export const ShareReliveStrEN:string = "respawn";
export const ShareDoubleStrEN:string = "double score";
/** 跳过 */
export const SkipStrCN:string = "<u>点击跳过</u>";
export const SkipStrEN:string = "<u>skip</u>";

//特效
/** 制造炸弹 */
export let BombStr:string = "制造炸弹";
export const BombStrCN:string = "制造炸弹";
export const BombStrEN:string = "Make bombs";
/** 缩小形状 */
export let NarrowingStr:string = "缩小形状";
export const NarrowingStrCN:string = "缩小形状";
export const NarrowingStrEN:string = "Shape narrowing";
/** 清屏一次 */
export let ClearStr:string = "清屏一次";
export const ClearStrCN:string = "清屏一次";
export const ClearStrEN:string = "Clear the screen";
/** 双倍分数 */
export let DoubleStr:string = "双倍分数";
export const DoubleStrCN:string = "双倍分数";
export const DoubleStrEN:string = "Double score";
/** 减速 */
export let FrozenStr:string = "减速";
export const FrozenStrCN:string = "减速";
export const FrozenStrEN:string = "Slow Down";
/** 同化形状 */
export let assimilationStr:string = "同化形状";
export const assimilationStrCN:string = "同化形状";
export const assimilationStrEN:string = "Same border";
/** 放大形状 */
export let expandingStr:string = "放大形状";
export const expandingStrCN:string = "放大形状";
export const expandingStrEN:string = "Shape expanding";
/** 一大波星星来袭 */
export let weaveStr:string = "一大波星星来袭";
export const weaveStrCN:string = "一大波星星来袭";
export const weaveStrEN:string = "Lots of stars are coming";

export function setEnglish(){
    BombOverStr = BombOverStrEN;
    HPEmptyStr = HPEmptyStrEN;
    BombStr = DoubleStrEN;
    NarrowingStr = NarrowingStrEN;
    DoubleStr = DoubleStrEN;
    FrozenStr = FrozenStrEN;
    ClearStr = ClearStrEN;
    assimilationStr = assimilationStrEN;
    expandingStr = expandingStrEN;
    weaveStr = weaveStrEN;
}

export function setChinese(){
    BombOverStr = BombOverStrCN;
    HPEmptyStr = HPEmptyStrCN;
    BombStr = DoubleStrCN;
    NarrowingStr = NarrowingStrCN;
    DoubleStr = DoubleStrCN;
    FrozenStr = FrozenStrCN;
    ClearStr = ClearStrCN;
    assimilationStr = assimilationStrCN;
    expandingStr = expandingStrCN;
    weaveStr = weaveStrCN;
}