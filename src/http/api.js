import service from './index'

export default {
    // 登录
    //     username	用户名	不能为空
    // password	密码	不能为空
    login(params) {
        return service.post('login', params)
    },

    // 用户数据列表
    // query	查询参数	可以为空
    // pagenum	当前页码	不能为空
    // pagesize	每页显示条数	不能为空
    getUserList(query, pagenum, pagesize) {
        return service.get(`users?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
    },

    // 添加用户
    //     username	用户名称	不能为空
    // password	用户密码	不能为空
    // email	邮箱	可以为空
    // mobile	手机号	可以为空
    addUser(params) {
        return service.post('users', params)
    },

    // 修改用户状态
    // uId	用户 ID	不能为空携带在url中
    // type	用户状态	不能为空携带在url中，值为 true 或者 false
    modifyUser(uId, type) {
        return service.put(`users/${uId}/state/${type}`)
    },

    // 根据id查询用户
    // id	用户 ID	不能为空
    getUser(id) {
        return service.get(`users/${id}`)
    },

    // 编辑用户提交
    //     id	用户 id	不能为空 参数是url参数:id
    // email	邮箱	可以为空
    // mobile	手机号	可以为空
    editUser(id, params) {
        return service.put(`users/${id}`, params)
    },

    // 删除单个用户
    // id	用户 id	不能为空参数是url参数:id
    delUser(id) {
        return service.delete(`users/${id}`)
    },

    // 分配用户角色
    //     id	用户 ID	不能为空参数是url参数:id
    // rid	角色 id	不能为空参数body参数
    allotUser(id, rid) {
        return service.put(`users/:${id}/role`, rid)
    },

    // 权限管理
    // 所有权限列表
    // type	类型	值 list 或 tree , list 列表显示权限, tree 树状显示权限,参数是url参数:type
    authorityList(type) {
        return service.get(`rights/${type}`)
    },

    // 左侧菜单权限
    getMenus() {
        return service.get('menus')
    },

    // 角色管理
    // 角色列表
    getRoles() {
        return service.get('roles')
    },

    // 添加角色
    //     roleName	角色名称	不能为空
    // roleDesc	角色描述	可以为空
    addRoles(params) {
        return service.post('roles', params)
    },

    // 根据 ID 查询角色
    getRole(id) {
        return service.get(`roles/${id}`)
    },
    // 编辑提交角色
    // :id	角色 ID	不能为空携带在url中
    // roleName	角色名称	不能为空
    // roleDesc	角色描述	可以为空
    editRole(id, params) {
        return service.put(`roles/${id}`, params)
    },

    // 删除角色
    // :id	角色 ID	不能为空携带在url中
    delRole(id) {
        return service.delete(`roles/${id}`)
    },

    // 角色授权
    // :roleId	角色 ID	不能为空携带在url中
    // rids	权限 ID 列表（字符串）	以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
    impowerRole(roleId, rids) {
        return service.post(`roles/:${roleId}/rights`, rids)
    },

    // 删除角色指定权限
    //     :roleId	角色 ID	不能为空携带在url中
    // :rightId	权限 ID	不能为空携带在url中
    delRole(roleId, rightId) {
        return service.delete(`roles/:${roleId}/rights/${rightId}`)
    },

    // 商品分类管理
    // 商品分类数据列表
    //     type	[1,2,3]	值：1，2，3 分别表示显示一层二层三层分类列表
    // 【可选参数】如果不传递，则默认获取所有级别的分类
    // pagenum	当前页码值	【可选参数】如果不传递，则默认获取所有分类
    // pagesize	每页显示多少条数据	【可选参数】如果不传递，则默认获取所有分类
    getCategories(type, pagenum, pagesize) {
        return service.get(`categories?type=${type}&pagenum=${pagenum}&pagesize=${pagesize}`)
    },

    // 添加分类
    //     cat_pid	分类父 ID	不能为空，如果要添加1级分类，则父分类Id应该设置为 0
    // cat_name	分类名称	不能为空
    // cat_level	分类层级	不能为空，0表示一级分类；1表示二级分类；2表示三级分类
    addCategory(params) {
        return service.post(`categories `, params)
    },

    // 根据 id 查询分类
    // :id	分类 ID	不能为空携带在url中
    getCategory(id) {
        return service.get(`categories/:${id} `)
    },

    // 编辑提交分类
    //     :id	分类 ID	不能为空携带在url中
    // cat_name	分类名称	不能为空【此参数，放到请求体中】
    editCategory(id, cat_name) {
        return service.put(`categories/:${id}?cat_name=${cat_name}`)
    },

    // 删除分类
    // :id	分类 ID	不能为空
    delCategory(id) {
        return service.delete(`categories/:${id} `)
    },

    // 分类参数管理
    // 参数列表
    //     :id	分类 ID	不能为空携带在url中
    // sel	[only,many]	不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
    getAttributes(id, sel) {
        return service.get(`categories/:${id}/attributes?sel=${sel}`)
    },

    // 添加动态参数或者静态属性
    //     :id	分类 ID	不能为空携带在url中
    // attr_name	参数名称	不能为空
    // attr_sel	[only,many]	不能为空
    // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔	【可选参数】
    addCategories(id, params) {
        return service.post(`categories/${id}/attributes`, params)
    },

    // 删除参数
    // :id	分类 ID	不能为空携带在url中
    // :attrid	参数 ID	不能为空携带在url中
    delCategories(id, attrid) {
        return service.delete(`categories/${id}/attributes/${attrid}`)
    },

    // 根据 ID 查询参数
    //     :id	分类 ID	不能为空携带在url中
    // :attrId	属性 ID	不能为空携带在url中
    // attr_sel	[only,many]	不能为空
    // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔	
    getAttribute(id, attrId, attr_sel, attr_vals) {
        return service.get(`categories/:${id}/attributes/${attrId}?attr_sel=${attr_sel}&attr_vals=${attr_vals}`)
    },

    // 编辑提交参数
    //     :id	分类 ID	不能为空携带在url中
    // :attrId	属性 ID	不能为空携带在url中
    // attr_name	新属性的名字	不能为空，携带在请求体中
    // attr_sel	属性的类型[many或only]	不能为空，携带在请求体中
    // attr_vals	参数的属性值	可选参数，携带在请求体中
    editAttribute(id, attrId, params) {
        return service.put(`categories/:${id}/attributes/${attrId}`, params)
    },

    // 商品管理
    // 商品列表数据
    //     query	查询参数	可以为空
    // pagenum	当前页码	不能为空
    // pagesize	每页显示条数	不能为空
    getGoods(query, pagenum, pagesize) {
        return service.get(`goods?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}`)
    },

    // 添加商品
    //     goods_name	商品名称	不能为空
    // goods_cat	以为','分割的分类列表	不能为空
    // goods_price	价格	不能为空
    // goods_number	数量	不能为空
    // goods_weight	重量	不能为空
    // goods_introduce	介绍	可以为空
    // pics	上传的图片临时路径（对象）	可以为空
    // attrs	商品的参数（数组），包含 动态参数 和 静态属性	可以为空
    addGoods(params) {
        return service.post(`goods`, params)
    },

    // 根据 ID 查询商品
    // id	商品 ID	不能为空
    getGood(id) {
        return service.get(`goods/${id}`)
    },

    // 编辑提交商品(只做效果,不提交接口)id	商品 ID	不能为空携带在url中
    // goods_name 商品名称 不能为空
    // goods_price 价格 不能为空
    // goods_number 数量 不能为空
    // goods_weight 重量 不能为空
    // goods_introduce 介绍 可以为空
    // pics 上传的图片临时路径（ 对象） 可以为空
    // attrs 商品的参数（ 数组） 可以为空
    editGoods(id, params) {
        return service.put(`goods/${id}`, params)
    },

    // 删除商品
    // id	商品 ID	不能为空
    delGoods(id) {
        return service.delete(`goods/${id}`)
    },
    // 同步商品图片
    //     id	商品 ID	不能为空携带在url中
    // pics	商品图片集合	如果有 pics_id 字段会保留该图片，如果没有 pics_id 但是有 pic 字段就会新生成图片数据
    updatePics(id, pics) {
        return service.put(`goods/${id}/pics`, pics)
    },

    // 同步商品属性
    // id	商品 ID	不能为空携带在url中
    updateAttributes(id) {
        return service.put(`goods/${id}/attributes`)
    },

    // 商品图片处理必须安装 GraphicsMagick

    // 图片上传
    // file	上传文件	
    upload(file) {
        return service.post(`upload`, file)
    },

    // 订单管理
    // 订单数据列表
    //     query	查询参数	可以为空
    // pagenum	当前页码	不能为空
    // pagesize	每页显示条数	不能为空
    // user_id	用户 ID	可以为空
    // pay_status	支付状态	可以为空
    // is_send	是否发货	可以为空
    // order_fapiao_title	['个人','公司']	可以为空
    // order_fapiao_company	公司名称	可以为空
    // order_fapiao_content	发票内容	可以为空
    // consignee_addr	发货地址	可以为空
    getOrders(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) {
        return service.get(`orders?query=${query}&pagenum=${pagenum}&pagesize=${pagesize}&user_id=${user_id}&pay_status=${pay_status}&is_send=${is_send}&order_fapiao_title=${order_fapiao_title}&order_fapiao_company=${order_fapiao_company}&order_fapiao_content=${order_fapiao_content}&consignee_addr=${consignee_addr}`)
    },

    // 修改订单状态
    // id 订单 ID 不能为空携带在url中
    // is_send 订单是否发货 1: 已经发货， 0: 未发货
    // order_pay 订单支付 支付方式 0 未支付 1 支付宝 2 微信 3 银行卡
    // order_price 订单价格
    // order_number 订单数量
    // pay_status 支付状态 订单状态： 0 未付款、 1 已付款
    editOrders(id, params) {
        return service.put(`orders/${id}`, params)
    },

    // 查看订单详情
    // id	订单 ID	不能为空
    orderDetails(id) {
        return service.get(`orders/${id}`)
    },
    // 修改地址

    // 查看物流信息
    // 供测试的物流单号：1106975712662 或者 804909574412544600
    getKuaidi(id) {
        return service.get(`kuaidi/${id}`)
    },

    // 数据统计
    // 基于时间统计的折线图
    getReports() {
        return service.get(`reports/type/1`)
    },
}