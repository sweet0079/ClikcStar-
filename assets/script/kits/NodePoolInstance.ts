
import ShapeManager from './ShapeManager';
import shapeControl from './ShapeControl';
import clickshape from './ClikcShape'

export default class NodePoolInstance {
    static instance: NodePoolInstance
    /** 获取单例 */
    static getinstance() {
        if (NodePoolInstance.instance) return NodePoolInstance.instance;
        else return new NodePoolInstance();
    }
    /** 返回一个新的单例 */
    static newinstance() {
        return new NodePoolInstance();
    }

    private constructor() {
        NodePoolInstance.instance = this;
        this.shapePool = new cc.NodePool();
    }

    private shapePool: cc.NodePool;

    createEnemy(shapePrefab:cc.Prefab) {
        let shape = null;
        if (this.shapePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            shape = this.shapePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            shape = cc.instantiate(shapePrefab);
        }
        shape.getComponent(shapeControl).init();
        shape.getComponent(clickshape).init();
        return shape;
        // shape.parent = parentNode; // 将生成的敌人加入节点树
        // enemy.getComponent('Enemy').init(); //接下来就可以调用 enemy 身上的脚本进行初始化
    }

    dissShape(shape:cc.Node) {
        // enemy 应该是一个 cc.Node
        ShapeManager.getinstance().delShape(shape);
        this.shapePool.put(shape); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
}