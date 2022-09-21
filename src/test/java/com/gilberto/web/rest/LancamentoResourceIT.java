package com.gilberto.web.rest;

import static com.gilberto.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gilberto.IntegrationTest;
import com.gilberto.domain.Lancamento;
import com.gilberto.domain.enumeration.TipoLancamento;
import com.gilberto.repository.LancamentoRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link LancamentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LancamentoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_VENCIMENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_VENCIMENTO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_PAGAMENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_PAGAMENTO = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_VALOR = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR = new BigDecimal(2);

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final TipoLancamento DEFAULT_TIPO = TipoLancamento.RECEITA;
    private static final TipoLancamento UPDATED_TIPO = TipoLancamento.DESPESA;

    private static final String ENTITY_API_URL = "/api/lancamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLancamentoMockMvc;

    private Lancamento lancamento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lancamento createEntity(EntityManager em) {
        Lancamento lancamento = new Lancamento()
            .descricao(DEFAULT_DESCRICAO)
            .dataVencimento(DEFAULT_DATA_VENCIMENTO)
            .dataPagamento(DEFAULT_DATA_PAGAMENTO)
            .valor(DEFAULT_VALOR)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .tipo(DEFAULT_TIPO);
        return lancamento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lancamento createUpdatedEntity(EntityManager em) {
        Lancamento lancamento = new Lancamento()
            .descricao(UPDATED_DESCRICAO)
            .dataVencimento(UPDATED_DATA_VENCIMENTO)
            .dataPagamento(UPDATED_DATA_PAGAMENTO)
            .valor(UPDATED_VALOR)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tipo(UPDATED_TIPO);
        return lancamento;
    }

    @BeforeEach
    public void initTest() {
        lancamento = createEntity(em);
    }

    @Test
    @Transactional
    void createLancamento() throws Exception {
        int databaseSizeBeforeCreate = lancamentoRepository.findAll().size();
        // Create the Lancamento
        restLancamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lancamento)))
            .andExpect(status().isCreated());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeCreate + 1);
        Lancamento testLancamento = lancamentoList.get(lancamentoList.size() - 1);
        assertThat(testLancamento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testLancamento.getDataVencimento()).isEqualTo(DEFAULT_DATA_VENCIMENTO);
        assertThat(testLancamento.getDataPagamento()).isEqualTo(DEFAULT_DATA_PAGAMENTO);
        assertThat(testLancamento.getValor()).isEqualByComparingTo(DEFAULT_VALOR);
        assertThat(testLancamento.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLancamento.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLancamento.getTipo()).isEqualTo(DEFAULT_TIPO);
    }

    @Test
    @Transactional
    void createLancamentoWithExistingId() throws Exception {
        // Create the Lancamento with an existing ID
        lancamento.setId(1L);

        int databaseSizeBeforeCreate = lancamentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLancamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lancamento)))
            .andExpect(status().isBadRequest());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLancamentos() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        // Get all the lancamentoList
        restLancamentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lancamento.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].dataVencimento").value(hasItem(DEFAULT_DATA_VENCIMENTO.toString())))
            .andExpect(jsonPath("$.[*].dataPagamento").value(hasItem(DEFAULT_DATA_PAGAMENTO.toString())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(sameNumber(DEFAULT_VALOR))))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())));
    }

    @Test
    @Transactional
    void getLancamento() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        // Get the lancamento
        restLancamentoMockMvc
            .perform(get(ENTITY_API_URL_ID, lancamento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lancamento.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.dataVencimento").value(DEFAULT_DATA_VENCIMENTO.toString()))
            .andExpect(jsonPath("$.dataPagamento").value(DEFAULT_DATA_PAGAMENTO.toString()))
            .andExpect(jsonPath("$.valor").value(sameNumber(DEFAULT_VALOR)))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLancamento() throws Exception {
        // Get the lancamento
        restLancamentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLancamento() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();

        // Update the lancamento
        Lancamento updatedLancamento = lancamentoRepository.findById(lancamento.getId()).get();
        // Disconnect from session so that the updates on updatedLancamento are not directly saved in db
        em.detach(updatedLancamento);
        updatedLancamento
            .descricao(UPDATED_DESCRICAO)
            .dataVencimento(UPDATED_DATA_VENCIMENTO)
            .dataPagamento(UPDATED_DATA_PAGAMENTO)
            .valor(UPDATED_VALOR)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tipo(UPDATED_TIPO);

        restLancamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLancamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLancamento))
            )
            .andExpect(status().isOk());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
        Lancamento testLancamento = lancamentoList.get(lancamentoList.size() - 1);
        assertThat(testLancamento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testLancamento.getDataVencimento()).isEqualTo(UPDATED_DATA_VENCIMENTO);
        assertThat(testLancamento.getDataPagamento()).isEqualTo(UPDATED_DATA_PAGAMENTO);
        assertThat(testLancamento.getValor()).isEqualByComparingTo(UPDATED_VALOR);
        assertThat(testLancamento.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLancamento.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLancamento.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void putNonExistingLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lancamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lancamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lancamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lancamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLancamentoWithPatch() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();

        // Update the lancamento using partial update
        Lancamento partialUpdatedLancamento = new Lancamento();
        partialUpdatedLancamento.setId(lancamento.getId());

        partialUpdatedLancamento
            .descricao(UPDATED_DESCRICAO)
            .dataVencimento(UPDATED_DATA_VENCIMENTO)
            .dataPagamento(UPDATED_DATA_PAGAMENTO)
            .endDate(UPDATED_END_DATE);

        restLancamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLancamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLancamento))
            )
            .andExpect(status().isOk());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
        Lancamento testLancamento = lancamentoList.get(lancamentoList.size() - 1);
        assertThat(testLancamento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testLancamento.getDataVencimento()).isEqualTo(UPDATED_DATA_VENCIMENTO);
        assertThat(testLancamento.getDataPagamento()).isEqualTo(UPDATED_DATA_PAGAMENTO);
        assertThat(testLancamento.getValor()).isEqualByComparingTo(DEFAULT_VALOR);
        assertThat(testLancamento.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLancamento.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLancamento.getTipo()).isEqualTo(DEFAULT_TIPO);
    }

    @Test
    @Transactional
    void fullUpdateLancamentoWithPatch() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();

        // Update the lancamento using partial update
        Lancamento partialUpdatedLancamento = new Lancamento();
        partialUpdatedLancamento.setId(lancamento.getId());

        partialUpdatedLancamento
            .descricao(UPDATED_DESCRICAO)
            .dataVencimento(UPDATED_DATA_VENCIMENTO)
            .dataPagamento(UPDATED_DATA_PAGAMENTO)
            .valor(UPDATED_VALOR)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tipo(UPDATED_TIPO);

        restLancamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLancamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLancamento))
            )
            .andExpect(status().isOk());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
        Lancamento testLancamento = lancamentoList.get(lancamentoList.size() - 1);
        assertThat(testLancamento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testLancamento.getDataVencimento()).isEqualTo(UPDATED_DATA_VENCIMENTO);
        assertThat(testLancamento.getDataPagamento()).isEqualTo(UPDATED_DATA_PAGAMENTO);
        assertThat(testLancamento.getValor()).isEqualByComparingTo(UPDATED_VALOR);
        assertThat(testLancamento.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLancamento.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLancamento.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void patchNonExistingLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lancamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lancamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lancamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLancamento() throws Exception {
        int databaseSizeBeforeUpdate = lancamentoRepository.findAll().size();
        lancamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLancamentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lancamento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lancamento in the database
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLancamento() throws Exception {
        // Initialize the database
        lancamentoRepository.saveAndFlush(lancamento);

        int databaseSizeBeforeDelete = lancamentoRepository.findAll().size();

        // Delete the lancamento
        restLancamentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, lancamento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Lancamento> lancamentoList = lancamentoRepository.findAll();
        assertThat(lancamentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
