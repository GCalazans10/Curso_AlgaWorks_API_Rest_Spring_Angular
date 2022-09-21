package com.gilberto.web.rest;

import com.gilberto.domain.Permicao;
import com.gilberto.repository.PermicaoRepository;
import com.gilberto.service.PermicaoService;
import com.gilberto.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gilberto.domain.Permicao}.
 */
@RestController
@RequestMapping("/api")
public class PermicaoResource {

    private final Logger log = LoggerFactory.getLogger(PermicaoResource.class);

    private static final String ENTITY_NAME = "permicao";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PermicaoService permicaoService;

    private final PermicaoRepository permicaoRepository;

    public PermicaoResource(PermicaoService permicaoService, PermicaoRepository permicaoRepository) {
        this.permicaoService = permicaoService;
        this.permicaoRepository = permicaoRepository;
    }

    /**
     * {@code POST  /permicaos} : Create a new permicao.
     *
     * @param permicao the permicao to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new permicao, or with status {@code 400 (Bad Request)} if the permicao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/permicaos")
    public ResponseEntity<Permicao> createPermicao(@RequestBody Permicao permicao) throws URISyntaxException {
        log.debug("REST request to save Permicao : {}", permicao);
        if (permicao.getId() != null) {
            throw new BadRequestAlertException("A new permicao cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Permicao result = permicaoService.save(permicao);
        return ResponseEntity
            .created(new URI("/api/permicaos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /permicaos/:id} : Updates an existing permicao.
     *
     * @param id the id of the permicao to save.
     * @param permicao the permicao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated permicao,
     * or with status {@code 400 (Bad Request)} if the permicao is not valid,
     * or with status {@code 500 (Internal Server Error)} if the permicao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/permicaos/{id}")
    public ResponseEntity<Permicao> updatePermicao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Permicao permicao
    ) throws URISyntaxException {
        log.debug("REST request to update Permicao : {}, {}", id, permicao);
        if (permicao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, permicao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!permicaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Permicao result = permicaoService.update(permicao);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, permicao.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /permicaos/:id} : Partial updates given fields of an existing permicao, field will ignore if it is null
     *
     * @param id the id of the permicao to save.
     * @param permicao the permicao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated permicao,
     * or with status {@code 400 (Bad Request)} if the permicao is not valid,
     * or with status {@code 404 (Not Found)} if the permicao is not found,
     * or with status {@code 500 (Internal Server Error)} if the permicao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/permicaos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Permicao> partialUpdatePermicao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Permicao permicao
    ) throws URISyntaxException {
        log.debug("REST request to partial update Permicao partially : {}, {}", id, permicao);
        if (permicao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, permicao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!permicaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Permicao> result = permicaoService.partialUpdate(permicao);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, permicao.getId().toString())
        );
    }

    /**
     * {@code GET  /permicaos} : get all the permicaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of permicaos in body.
     */
    @GetMapping("/permicaos")
    public List<Permicao> getAllPermicaos() {
        log.debug("REST request to get all Permicaos");
        return permicaoService.findAll();
    }

    /**
     * {@code GET  /permicaos/:id} : get the "id" permicao.
     *
     * @param id the id of the permicao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the permicao, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/permicaos/{id}")
    public ResponseEntity<Permicao> getPermicao(@PathVariable Long id) {
        log.debug("REST request to get Permicao : {}", id);
        Optional<Permicao> permicao = permicaoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(permicao);
    }

    /**
     * {@code DELETE  /permicaos/:id} : delete the "id" permicao.
     *
     * @param id the id of the permicao to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/permicaos/{id}")
    public ResponseEntity<Void> deletePermicao(@PathVariable Long id) {
        log.debug("REST request to delete Permicao : {}", id);
        permicaoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
