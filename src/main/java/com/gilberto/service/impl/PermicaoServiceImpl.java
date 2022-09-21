package com.gilberto.service.impl;

import com.gilberto.domain.Permicao;
import com.gilberto.repository.PermicaoRepository;
import com.gilberto.service.PermicaoService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Permicao}.
 */
@Service
@Transactional
public class PermicaoServiceImpl implements PermicaoService {

    private final Logger log = LoggerFactory.getLogger(PermicaoServiceImpl.class);

    private final PermicaoRepository permicaoRepository;

    public PermicaoServiceImpl(PermicaoRepository permicaoRepository) {
        this.permicaoRepository = permicaoRepository;
    }

    @Override
    public Permicao save(Permicao permicao) {
        log.debug("Request to save Permicao : {}", permicao);
        return permicaoRepository.save(permicao);
    }

    @Override
    public Permicao update(Permicao permicao) {
        log.debug("Request to update Permicao : {}", permicao);
        return permicaoRepository.save(permicao);
    }

    @Override
    public Optional<Permicao> partialUpdate(Permicao permicao) {
        log.debug("Request to partially update Permicao : {}", permicao);

        return permicaoRepository
            .findById(permicao.getId())
            .map(existingPermicao -> {
                if (permicao.getDescricao() != null) {
                    existingPermicao.setDescricao(permicao.getDescricao());
                }

                return existingPermicao;
            })
            .map(permicaoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Permicao> findAll() {
        log.debug("Request to get all Permicaos");
        return permicaoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Permicao> findOne(Long id) {
        log.debug("Request to get Permicao : {}", id);
        return permicaoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Permicao : {}", id);
        permicaoRepository.deleteById(id);
    }
}
