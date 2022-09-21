package com.gilberto.repository;

import com.gilberto.domain.Permicao;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Permicao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PermicaoRepository extends JpaRepository<Permicao, Long> {}
