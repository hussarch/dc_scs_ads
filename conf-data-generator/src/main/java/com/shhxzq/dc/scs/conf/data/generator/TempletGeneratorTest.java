package com.shhxzq.dc.scs.conf.data.generator;

import com.shhxzq.dc.scs.conf.data.generator.website.edu.QuestionAnswerEntity;
import com.shhxzq.dc.scs.frm.cdf.TempletGenerator;

public class TempletGeneratorTest {
   
    public static void main(String[] args) {
        String path = "/Users/sailor/git/adapter-data-sys/conf-data/";
        TempletGenerator.writeTemplet(QuestionAnswerEntity.class, path, true);
    }
    
}