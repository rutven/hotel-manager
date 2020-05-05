package name.legkodymov.hotel.repository;

import name.legkodymov.hotel.domain.Guest;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Guest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
}
