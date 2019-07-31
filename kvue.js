class KVue {
    constructor(options) {
        // 保存data选项
        this.$data = options.data;
        // 执行响应式
        this.observe(this.$data);

        this.$options = options;

        // test watcher
        new Watcher();
        // 读会触发defineReactive的get方法，可以在哪里测试watcher
        console.log('模拟compile', this.$data.test)

        // test compile
        this.$compile = new Compile(options.el, this)
    }

    observe(value) {
        if(!value || typeof value !== 'object') {
            return ;
        }
        // 遍历data选项
        Object.keys(value).forEach(key => {
            // 给每一个key定义一个get-set-响应式
            this.defineReactive(value, key, value[key]);
            // 为vue的data做属性代理
            this.proxyData(key);
        })
    }
    defineReactive(obj, key, val) {
        // 内层递归 查找嵌套属性
        this.observe(val);

        // 创建dep
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            enumerable:true, //可枚举
            configurable:true, // 可修改或删除
            get(){
                Dep.target && dep.addDep(Dep.target);
                console.log(dep.deps);
                return val;
            },
            set(newVal){
                if(newVal === val){
                    return ;
                }
                val = newVal;
                console.log('数据发生变化')
                dep.notify();
            }
        })
    }
    proxyData(key) {
        Object.defineProperty(this, key, {
                get(){
                    return this.$data[key];
                },
                set(newVal){
                    this.$data[key] = newVal;
                }
        })
    }
}

// 依赖管理器：负责将视图中所有依赖收集管理，包括依赖添加和通知
class Dep {
    constructor(){
        this.deps = []; // 依赖管理器deps中存放的是watcher的实例   
    }
    addDep(dep){
        this.deps.push(dep);
    }
    notify(){
        this.deps.forEach(dep => {
            dep.update();
        })
    }
}

// watcher:具体的更新执行者
class  Watcher {
    constructor(vm, key, cb){
        // 作为成员变量保存下去
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        // 将来new一个监听器时，将当前watcher实例附加到Dep.target
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null
    }
    // 更新
    update(){
        console.log('视图更新')
        // 设置上下文
        this.cb.call(this.vm, this.vm[this.key]);
        
    }
}