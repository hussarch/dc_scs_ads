package com.shhxzq.dc.scs.conf.data.generator.website.edu;

import java.util.Date;

import com.shhxzq.dc.scs.frm.base.page.anotations.ApiDesc;
import com.shhxzq.dc.scs.frm.base.page.anotations.FieldDesc;
import com.shhxzq.dc.scs.frm.base.page.anotations.PageDesc;
import com.shhxzq.dc.scs.frm.base.page.type.ApiType;
import com.shhxzq.dc.scs.frm.base.page.type.PageType;

/**
 * @author XiaoYi Created on 2017-07-20 11:00:26
 */
@PageDesc(path = { "website", "edu", "qa" }, serviceId = "question_answer", title = "常见问答", params = { "type" })
@ApiDesc(serviceId = "qaList", name = "常见问答列表", params = { "type" }, type = ApiType.list)
@ApiDesc(serviceId = "qaDetail", name = "常见问答详情", params = { "id" }, type = ApiType.detail)
public class QuestionAnswerEntity {

    @FieldDesc(label = "ID", hidden = true, notShowIn = { PageType.add }, apiType = { ApiType.list, ApiType.detail })
    private Integer id;

    @FieldDesc(label = "问题", search = true, max = 100, apiType = { ApiType.list, ApiType.detail })
    private String question;

    @FieldDesc(label = "答案", search = true, max = 500, apiType = { ApiType.list, ApiType.detail })
    private String answer;

    private String type;

    @FieldDesc(label = "序号", search = true, showIn = { PageType.table }, hidden = true)
    private Integer indexNum;

    @FieldDesc(label = "创建时间", showIn = {}, apiType = { ApiType.list, ApiType.detail })
    private Date createdAt;
    private Date updatedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getIndexNum() {
        return indexNum;
    }

    public void setIndexNum(Integer indexNum) {
        this.indexNum = indexNum;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

}
