package com.shhxzq.dc.scs.conf.data.generator;

import com.shhxzq.dc.scs.conf.data.generator.website.edu.QuestionAnswerEntity;
import com.shhxzq.dc.scs.frm.cdf.TempletGenerator;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.ApiDesc;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.CategoryDesc;
import com.shhxzq.dc.scs.frm.cdf.templete.anotations.PageDesc;

public class TempletGeneratorTest {
   
    @PageDesc(path = { "website", "edu", "qa" }, name = "常见问答")
    @ApiDesc(serviceId = "qaList", name = "常见问答列表", params = { "type" })
    @ApiDesc(serviceId = "qaDetail", name = "常见问答详情", params = { "id" })
    @CategoryDesc(fieldName = "type", group = {"news:资讯新闻", "edu:教育文档"})
    public QuestionAnswerEntity generateQuestionAnswerEntity(QuestionAnswerEntity entity){
        
        
        return null;
    }
    
    public static void main(String[] args) {
        String path = "/Users/sailor/git/adapter-data-sys/conf-data/";
        TempletGenerator.writeTemplet(QuestionAnswerEntity.class, path, true);
    }
    
}