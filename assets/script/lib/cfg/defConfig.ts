/** 飞行轨迹枚举 */
export const Flightpath = cc.Enum({
    // 长直线
    straight: -1,
    // // 长曲线
    // curve: -1,
    // // 螺旋
    // screw: -1,
    // // 转向
    // turn: -1,
    // // 回退,
    // back: -1
    // 枚举的长度
    length: -1,
});
/** 出生点位置枚举 */
export const birthpoint = cc.Enum({
    // 左
    left: -1,
    // 左上角
    lefttop: -1,
    // 上
    top: -1,
    // 右上角上
    righttop: -1,
    // 右
    right: -1,
    // 右下角
    rightbottom: -1,
    // 下
    bottom: -1,
    // 左下角
    leftbottom: -1,
});
/** 碰撞边界枚举 */
export const lastReboundPos = cc.Enum({    
    // 其他（无或者4个角）
    other: -1,
    // 左
    left: -1,
    // 上
    top: -1,
    // 右
    right: -1,
    // 下
    bottom: -1,
});
/** 形状出生位置枚举 */
export const shapebirthpos = cc.Enum({
    // 左
    left: -1,
    // 上
    top: -1,
    // 右
    right: -1,
    // 下
    bottom: -1,
});
/** 形状特性枚举 */
export const character = cc.Enum({
    // 无
    none: -1,
    // 大小变化
    scale: -1,
    // 速度变化
    speed: -1,
    // 分裂
    division: -1,
    // 旋转
    rotate: -1,
    // // 翻转
    // flipping: -1,
    // 渐隐
    fadeout: -1,
    // // 闪烁
    // blink: -1,
    // 枚举的长度
    length: -1,
});
/** 形状特性枚举 */
export const dissipate = cc.Enum({    
    
    none: -1,// 无
    
    fragmentation: -1,// 碎裂
    
    integration: -1,// 融入
    
    disappear: -1,// 消失
    
    drop: -1,// 掉落

    sticky: -1,// 黏滞
    
    rebound: -1,// 反弹
    
    decompose: -1,// 分解
    
    length: -1,// 枚举的长度
});
/** 形状外形枚举 */
export const shape = cc.Enum({
    // 三角形
    triangle: 2,
    // 五角星
    star: 3,
    // 圆形
    circular: 1,
    // 平行四边形
    // parallelogram: 8,
    // 方形
    square: 0,
    // 梯形
    // trapezoid: 4,
    // // 椭圆
    // ellipse: 6,
    // 菱形
    // diamond: 3,
    // // 长方形
    // rectangle: 3,
    // // 半月
    // halfmoon: 9,
    // 十字形
    cross: 4,
    // 六边形
    // Hexagon: 5,
    // 枚举的长度
    length: 5,
});
/** 套路大类型枚举 */
export const Tricks = cc.Enum({
    //齐射
    volley: -1,
    //对称
    symmetry: -1,
    //联合
    union: -1,
    //有序
    order: -1,
    //15个形状飞瀑
    Waterfall15: -1,
    //25个形状飞瀑
    Waterfall25: -1,
    //集中
    focus: -1,
    //集中分裂
    focusDiv: -1,
    //交叉
    across: -1,
    //闪烁
    blink: -1,
    //传送
    transform: -1,
    //绝对反弹
    AbsoluteReb: -1,
    //阶梯
    ladder: -1,
    //错位
    overlapping: -1,
    //S型
    Stype: -1,
    //Fantastic4
    Fantastic4: -1,
    // 枚举的长度
    length: -1,
});
/** 套路大类型枚举 */
export const BlinkArr = cc.Enum({
    //全部
    all: [[true,true,true],
          [true,true,true],
          [true,true,true],
          [true,true,true],
          [true,true,true]],
    WenZiS:[[true,true,true],
            [true,false,false],
            [false,true,false],
            [false,false,true],
            [true,true,true]],
    WenZiT:[[true,true,true],
            [false,true,false],
            [false,true,false],
            [false,true,false],
            [false,true,false]],
    WenZiA:[[false,true,false],
            [true,false,true],
            [true,true,true],
            [true,false,true],
            [true,false,true]],
    WenZiR:[[true,true,true],
            [true,false,true],
            [true,true,true],
            [true,true,false],
            [true,false,true]],
    length:5,
});
//Boss飞入屏幕需要的时间
export const BossComingTime = 2;
//Boss存活时间
export const BossLivingTime = 7;
//Boss死亡淡出时间
export const BossDieTime = 1;
//套路开始前warning持续时间
export const WarningTime = 3;
//套路结束后持续时间
export const WeaveEndTime = 3;
//每个形状有几种颜色
export const ColorNum = 1;
//每个形状有几种消散特效
export const DissAniNum = 1;
//设计时中间用于点击区域的宽
export const DesignPlayWidth = 1080;
//设计时中间用于点击区域的高
export const DesignPlayHeight = 1620;
//HP上限
export const MAXHP = 6;
//power上限
export const MAXPOWER = 500;
//power梯度
export const POWERLap = 5;
//time上限
export const MAXTIME = 5;
//角度和弧度的转化系数
export const coefficient = 2 * Math.PI / 360;
/** 满能量正面效果枚举 */
export const positiveBuff = cc.Enum({
    // 全清
    allClean: -1,
    // 回满血
    health: -1,
    // 减速
    frozen: -1,
    // 双倍
    doubleScore: -1,
    // 同化
    assimilation: -1,
    // 放大
    big: -1,
    // 枚举的长度
    length: -1,
});
/** 满能量负面效果枚举 */
export const negitiveBuff = cc.Enum({
    // 创建5个炸弹
    createBomb: -1,
    // 缩小
    small: -1,
    // 枚举的长度
    length: -1,
});
/** 特殊图形生成时间节点 */
export const SpecialBirthTime = [5,7,14,21,28,35,42,48,54,60,65];
/** 血包个数 */
export const HealthNum = [4,4,3,3,2];
/** 双倍炸弹概率 */
export const DoubleBomb = [10,10,20,20,30,30,40,40,50,50];
/** boss血量数组 */
export const bossdifficulty = [18,20,24,25,30,32,36,40];