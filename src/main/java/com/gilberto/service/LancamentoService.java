package com.gilberto.service;

import com.gilberto.domain.Lancamento;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Lancamento}.
 */
public interface LancamentoService {
    /**
     * Save a lancamento.
     *
     * @param lancamento the entity to save.
     * @return the persisted entity.
     */
    Lancamento save(Lancamento lancamento);

    /**
     * Updates a lancamento.
     *
     * @param lancamento the entity to update.
     * @return the persisted entity.
     */
    Lancamento update(Lancamento lancamento);

    /**
     * Partially updates a lancamento.
     *
     * @param lancamento the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Lancamento> partialUpdate(Lancamento lancamento);

    /**
     * Get all the lancamentos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Lancamento> findAll(Pageable pageable);

    /**
     * Get the "id" lancamento.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Lancamento> findOne(Long id);

    /**
     * Delete the "id" lancamento.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
