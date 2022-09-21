package com.gilberto.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gilberto.IntegrationTest;
import com.gilberto.domain.Permicao;
import com.gilberto.repository.PermicaoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PermicaoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PermicaoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/permicaos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PermicaoRepository permicaoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPermicaoMockMvc;

    private Permicao permicao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Permicao createEntity(EntityManager em) {
        Permicao permicao = new Permicao().descricao(DEFAULT_DESCRICAO);
        return permicao;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Permicao createUpdatedEntity(EntityManager em) {
        Permicao permicao = new Permicao().descricao(UPDATED_DESCRICAO);
        return permicao;
    }

    @BeforeEach
    public void initTest() {
        permicao = createEntity(em);
    }

    @Test
    @Transactional
    void createPermicao() throws Exception {
        int databaseSizeBeforeCreate = permicaoRepository.findAll().size();
        // Create the Permicao
        restPermicaoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permicao)))
            .andExpect(status().isCreated());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeCreate + 1);
        Permicao testPermicao = permicaoList.get(permicaoList.size() - 1);
        assertThat(testPermicao.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
    }

    @Test
    @Transactional
    void createPermicaoWithExistingId() throws Exception {
        // Create the Permicao with an existing ID
        permicao.setId(1L);

        int databaseSizeBeforeCreate = permicaoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPermicaoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permicao)))
            .andExpect(status().isBadRequest());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPermicaos() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        // Get all the permicaoList
        restPermicaoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(permicao.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @Test
    @Transactional
    void getPermicao() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        // Get the permicao
        restPermicaoMockMvc
            .perform(get(ENTITY_API_URL_ID, permicao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(permicao.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingPermicao() throws Exception {
        // Get the permicao
        restPermicaoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPermicao() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();

        // Update the permicao
        Permicao updatedPermicao = permicaoRepository.findById(permicao.getId()).get();
        // Disconnect from session so that the updates on updatedPermicao are not directly saved in db
        em.detach(updatedPermicao);
        updatedPermicao.descricao(UPDATED_DESCRICAO);

        restPermicaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPermicao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPermicao))
            )
            .andExpect(status().isOk());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
        Permicao testPermicao = permicaoList.get(permicaoList.size() - 1);
        assertThat(testPermicao.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void putNonExistingPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, permicao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(permicao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(permicao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(permicao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePermicaoWithPatch() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();

        // Update the permicao using partial update
        Permicao partialUpdatedPermicao = new Permicao();
        partialUpdatedPermicao.setId(permicao.getId());

        restPermicaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPermicao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPermicao))
            )
            .andExpect(status().isOk());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
        Permicao testPermicao = permicaoList.get(permicaoList.size() - 1);
        assertThat(testPermicao.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
    }

    @Test
    @Transactional
    void fullUpdatePermicaoWithPatch() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();

        // Update the permicao using partial update
        Permicao partialUpdatedPermicao = new Permicao();
        partialUpdatedPermicao.setId(permicao.getId());

        partialUpdatedPermicao.descricao(UPDATED_DESCRICAO);

        restPermicaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPermicao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPermicao))
            )
            .andExpect(status().isOk());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
        Permicao testPermicao = permicaoList.get(permicaoList.size() - 1);
        assertThat(testPermicao.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void patchNonExistingPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, permicao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(permicao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(permicao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPermicao() throws Exception {
        int databaseSizeBeforeUpdate = permicaoRepository.findAll().size();
        permicao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPermicaoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(permicao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Permicao in the database
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePermicao() throws Exception {
        // Initialize the database
        permicaoRepository.saveAndFlush(permicao);

        int databaseSizeBeforeDelete = permicaoRepository.findAll().size();

        // Delete the permicao
        restPermicaoMockMvc
            .perform(delete(ENTITY_API_URL_ID, permicao.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Permicao> permicaoList = permicaoRepository.findAll();
        assertThat(permicaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
