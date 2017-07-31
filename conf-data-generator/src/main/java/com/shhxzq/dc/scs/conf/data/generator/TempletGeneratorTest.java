package com.shhxzq.dc.scs.conf.data.generator;

import com.shhxzq.dc.scs.conf.data.generator.website.edu.QuestionAnswerEntity;
import com.shhxzq.dc.scs.frm.base.page.anotations.ApiDesc;
import com.shhxzq.dc.scs.frm.base.page.anotations.PageDesc;
import com.shhxzq.dc.scs.frm.base.page.type.ApiType;
import com.shhxzq.dc.scs.frm.cdf.TempletGenerator;

public class TempletGeneratorTest {
   
    @PageDesc(path = { "website", "edu", "qa" }, serviceId = "question_answer", title = "常见问答", params = { "type" })
    @ApiDesc(serviceId = "qaList", name = "常见问答列表", params = { "type" }, type = ApiType.list)
    @ApiDesc(serviceId = "qaDetail", name = "常见问答详情", params = { "id" }, type = ApiType.detail)
    public QuestionAnswerEntity generateQuestionAnswerEntity(QuestionAnswerEntity entity){
        
        
        return null;
    }
    
    public static void main(String[] args) {
        String path = "/Users/sailor/git/adapter-data-sys/conf-data/";
        TempletGenerator.writeTemplet(QuestionAnswerEntity.class, path, true);
    }
    
}