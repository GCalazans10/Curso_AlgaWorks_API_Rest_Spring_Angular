package com.gilberto.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gilberto.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PermicaoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Permicao.class);
        Permicao permicao1 = new Permicao();
        permicao1.setId(1L);
        Permicao permicao2 = new Permicao();
        permicao2.setId(permicao1.getId());
        assertThat(permicao1).isEqualTo(permicao2);
        permicao2.setId(2L);
        assertThat(permicao1).isNotEqualTo(permicao2);
        permicao1.setId(null);
        assertThat(permicao1).isNotEqualTo(permicao2);
    }
}
