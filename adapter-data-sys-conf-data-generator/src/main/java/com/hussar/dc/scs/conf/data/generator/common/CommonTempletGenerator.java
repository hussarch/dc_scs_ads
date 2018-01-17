package com.hussar.dc.scs.conf.data.generator.common;

import com.hussar.dc.scs.frm.base.common.type.PageType;
import com.hussar.dc.scs.frm.cdf.TempletGenerator;
import com.hussar.dc.scs.frm.cdf.templete.anotations.ApiDesc;
import com.hussar.dc.scs.frm.cdf.templete.anotations.PageDesc;
import com.hussar.dc.scs.frm.cdf.templete.anotations.PageFieldDesc;
import com.hussar.dc.scs.frm.core.jpa.entity.common.MenuEntity;
import com.hussar.dc.scs.frm.core.jpa.entity.common.RoleEntity;
import com.hussar.dc.scs.frm.core.jpa.entity.common.UserEntity;

/**
 * @author XiaoYi
 * Created on 2017-08-04 17:34:48
 */
public class CommonTempletGenerator {

    @PageDesc(path = { "common", "sys", "user" }, name = "用户", 
            entityClass = UserEntity.class)
    @PageFieldDesc(type = PageType.search, showFileds = {"name", "email"})
    @PageFieldDesc(type = PageType.table, notShowFileds = {"password", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.add, notShowFileds = {"id", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.update, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    @PageFieldDesc(type = PageType.view, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    public void defineUserEntity() {
    }
    
    @PageDesc(path = { "common", "sys", "role" }, name = "角色", 
            entityClass = RoleEntity.class)
    @PageFieldDesc(type = PageType.search, showFileds = {"name", "email"})
    @PageFieldDesc(type = PageType.table, notShowFileds = {"createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.add, notShowFileds = {"id", "users", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.update, notShowFileds = {"users", "createdAt", "updatedAt"}, hiddenFileds = "id")
    @PageFieldDesc(type = PageType.view, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    public void defineRoleEntity(){
    }
    
    @PageDesc(path = { "common", "sys", "menu" }, name = "导航菜单", entityClass = MenuEntity.class)
    @ApiDesc(serviceId = "list", name = "导航菜单列表", params = { "sysName" }, 
        notShowFileds = { "createdAt", "updatedAt" })
    public void defineMenuEntity() {
    }
    
    
    public static void main(String[] args) {
        String path = "/Users/sailor/git/adapter-data-sys/adapter-data-sys-conf-data/";
        TempletGenerator.writeTemplet(CommonTempletGenerator.class, "defineMenuEntity", path, true);

    }

}
