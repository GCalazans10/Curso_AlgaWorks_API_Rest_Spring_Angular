package com.gilberto.service.impl;

import com.gilberto.domain.Lancamento;
import com.gilberto.repository.LancamentoRepository;
import com.gilberto.service.LancamentoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Lancamento}.
 */
@Service
@Transactional
public class LancamentoServiceImpl implements LancamentoService {

    private final Logger log = LoggerFactory.getLogger(LancamentoServiceImpl.class);

    private final LancamentoRepository lancamentoRepository;

    public LancamentoServiceImpl(LancamentoRepository lancamentoRepository) {
        this.lancamentoRepository = lancamentoRepository;
    }

    @Override
    public Lancamento save(Lancamento lancamento) {
        log.debug("Request to save Lancamento : {}", lancamento);
        return lancamentoRepository.save(lancamento);
    }

    @Override
    public Lancamento update(Lancamento lancamento) {
        log.debug("Request to update Lancamento : {}", lancamento);
        return lancamentoRepository.save(lancamento);
    }

    @Override
    public Optional<Lancamento> partialUpdate(Lancamento lancamento) {
        log.debug("Request to partially update Lancamento : {}", lancamento);

        return lancamentoRepository
            .findById(lancamento.getId())
            .map(existingLancamento -> {
                if (lancamento.getDescricao() != null) {
                    existingLancamento.setDescricao(lancamento.getDescricao());
                }
                if (lancamento.getDataVencimento() != null) {
                    existingLancamento.setDataVencimento(lancamento.getDataVencimento());
                }
                if (lancamento.getDataPagamento() != null) {
                    existingLancamento.setDataPagamento(lancamento.getDataPagamento());
                }
                if (lancamento.getValor() != null) {
                    existingLancamento.setValor(lancamento.getValor());
                }
                if (lancamento.getStartDate() != null) {
                    existingLancamento.setStartDate(lancamento.getStartDate());
                }
                if (lancamento.getEndDate() != null) {
                    existingLancamento.setEndDate(lancamento.getEndDate());
                }
                if (lancamento.getTipo() != null) {
                    existingLancamento.setTipo(lancamento.getTipo());
                }

                return existingLancamento;
            })
            .map(lancamentoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Lancamento> findAll(Pageable pageable) {
        log.debug("Request to get all Lancamentos");
        return lancamentoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Lancamento> findOne(Long id) {
        log.debug("Request to get Lancamento : {}", id);
        return lancamentoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Lancamento : {}", id);
        lancamentoRepository.deleteById(id);
    }
}
