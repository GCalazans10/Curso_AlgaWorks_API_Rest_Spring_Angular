package com.gilberto.service.impl;

import com.gilberto.domain.Pessoa;
import com.gilberto.repository.PessoaRepository;
import com.gilberto.service.PessoaService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pessoa}.
 */
@Service
@Transactional
public class PessoaServiceImpl implements PessoaService {

    private final Logger log = LoggerFactory.getLogger(PessoaServiceImpl.class);

    private final PessoaRepository pessoaRepository;

    public PessoaServiceImpl(PessoaRepository pessoaRepository) {
        this.pessoaRepository = pessoaRepository;
    }

    @Override
    public Pessoa save(Pessoa pessoa) {
        log.debug("Request to save Pessoa : {}", pessoa);
        return pessoaRepository.save(pessoa);
    }

    @Override
    public Pessoa update(Pessoa pessoa) {
        log.debug("Request to update Pessoa : {}", pessoa);
        return pessoaRepository.save(pessoa);
    }

    @Override
    public Optional<Pessoa> partialUpdate(Pessoa pessoa) {
        log.debug("Request to partially update Pessoa : {}", pessoa);

        return pessoaRepository
            .findById(pessoa.getId())
            .map(existingPessoa -> {
                if (pessoa.getNome() != null) {
                    existingPessoa.setNome(pessoa.getNome());
                }
                if (pessoa.getAtivo() != null) {
                    existingPessoa.setAtivo(pessoa.getAtivo());
                }

                return existingPessoa;
            })
            .map(pessoaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pessoa> findAll() {
        log.debug("Request to get all Pessoas");
        return pessoaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pessoa> findOne(Long id) {
        log.debug("Request to get Pessoa : {}", id);
        return pessoaRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pessoa : {}", id);
        pessoaRepository.deleteById(id);
    }
}
