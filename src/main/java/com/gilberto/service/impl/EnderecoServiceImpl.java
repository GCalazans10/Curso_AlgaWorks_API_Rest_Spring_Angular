package com.gilberto.service.impl;

import com.gilberto.domain.Endereco;
import com.gilberto.repository.EnderecoRepository;
import com.gilberto.service.EnderecoService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Endereco}.
 */
@Service
@Transactional
public class EnderecoServiceImpl implements EnderecoService {

    private final Logger log = LoggerFactory.getLogger(EnderecoServiceImpl.class);

    private final EnderecoRepository enderecoRepository;

    public EnderecoServiceImpl(EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    @Override
    public Endereco save(Endereco endereco) {
        log.debug("Request to save Endereco : {}", endereco);
        return enderecoRepository.save(endereco);
    }

    @Override
    public Endereco update(Endereco endereco) {
        log.debug("Request to update Endereco : {}", endereco);
        return enderecoRepository.save(endereco);
    }

    @Override
    public Optional<Endereco> partialUpdate(Endereco endereco) {
        log.debug("Request to partially update Endereco : {}", endereco);

        return enderecoRepository
            .findById(endereco.getId())
            .map(existingEndereco -> {
                if (endereco.getLogradouro() != null) {
                    existingEndereco.setLogradouro(endereco.getLogradouro());
                }
                if (endereco.getNumero() != null) {
                    existingEndereco.setNumero(endereco.getNumero());
                }
                if (endereco.getComplemento() != null) {
                    existingEndereco.setComplemento(endereco.getComplemento());
                }
                if (endereco.getBairro() != null) {
                    existingEndereco.setBairro(endereco.getBairro());
                }
                if (endereco.getCep() != null) {
                    existingEndereco.setCep(endereco.getCep());
                }
                if (endereco.getCidade() != null) {
                    existingEndereco.setCidade(endereco.getCidade());
                }
                if (endereco.getEstado() != null) {
                    existingEndereco.setEstado(endereco.getEstado());
                }

                return existingEndereco;
            })
            .map(enderecoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Endereco> findAll() {
        log.debug("Request to get all Enderecos");
        return enderecoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Endereco> findOne(Long id) {
        log.debug("Request to get Endereco : {}", id);
        return enderecoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Endereco : {}", id);
        enderecoRepository.deleteById(id);
    }
}
