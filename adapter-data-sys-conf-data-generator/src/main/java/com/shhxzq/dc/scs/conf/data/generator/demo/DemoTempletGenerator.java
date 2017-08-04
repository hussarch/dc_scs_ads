package com.shhxzq.dc.scs.conf.data.generator.demo;

import com.shhxzq.dc.da.hxbisys.jpa.entity.RoleEntity;
import com.shhxzq.dc.da.hxbisys.jpa.entity.UserEntity;
import com.shhxzq.dc.da.hxbisys.jpa.entity.demo.DocumentEntity;
import com.shhxzq.dc.da.hxbisys.jpa.entity.demo.QuestionAnswerEntity;
import com.shhxzq.dc.scs.frm.base.common.type.PageType;
import com.shhxzq.dc.scs.frm.cdf.TempletGenerator;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.ApiDesc;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.CategoryDesc;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.PageDesc;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.PageFieldDesc;

/**
 * @author XiaoYi
 * Created on 2017-08-03 14:11:51
 */
public class DemoTempletGenerator {
    
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
    
    @PageDesc(path = { "website", "edu", "doc" }, name = "文档", category = "type", entityClass = DocumentEntity.class)
    @PageFieldDesc(type = PageType.search, showFileds = {"title", "sourceFrom"})
    @PageFieldDesc(type = PageType.table, notShowFileds = {"content", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.add, notShowFileds = {"id", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.update, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    @PageFieldDesc(type = PageType.view, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    @ApiDesc(serviceId = "list", name = "文档列表", params = { "type" }, 
        notShowFileds = { "createdAt", "updatedAt" })
    @ApiDesc(serviceId = "detail", name = "文档详情", params = { "id" }, 
        notShowFileds = { "createdAt", "updatedAt" })
    public void defineDocumentEntity() {
    }
    
    @PageDesc(path = { "website", "edu", "qa" }, name = "问答", entityClass = QuestionAnswerEntity.class)
    @PageFieldDesc(type = PageType.search, showFileds = {"question"})
    @PageFieldDesc(type = PageType.table, notShowFileds = {"answer", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.add, notShowFileds = {"id", "createdAt", "updatedAt"})
    @PageFieldDesc(type = PageType.update, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    @PageFieldDesc(type = PageType.view, notShowFileds = {"createdAt", "updatedAt"}, hiddenFileds = "id")
    @ApiDesc(serviceId = "list", name = "常见问答列表", params = { "type" }, 
        notShowFileds = { "createdAt", "updatedAt" })
    @ApiDesc(serviceId = "detail", name = "常见问答详情", params = { "id" }, 
        notShowFileds = { "createdAt", "updatedAt" })
    @CategoryDesc(fieldName = "type", group = {"HGT:沪港通", "ZXFG:政策法规", "BASIC:基础知识"})
    public void defineQaEntity() {
    }
    
    public static void main(String[] args) {
        String path = "/Users/sailor/git/adapter-data-sys/adapter-data-sys-conf-data/";
        TempletGenerator.writeTemplet(DemoTempletGenerator.class, "defineRoleEntity", path, true);

    }
}
