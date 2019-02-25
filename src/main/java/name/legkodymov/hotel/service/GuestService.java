package name.legkodymov.hotel.service;

import name.legkodymov.hotel.domain.Guest;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Guest.
 */
public interface GuestService {

    /**
     * Save a guest.
     *
     * @param guest the entity to save
     * @return the persisted entity
     */
    Guest save(Guest guest);

    /**
     * Get all the guests.
     *
     * @return the list of entities
     */
    List<Guest> findAll();


    /**
     * Get the "id" guest.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Guest> findOne(Long id);

    /**
     * Delete the "id" guest.
     *
     * @param id the id of the entity
     */
    void delete(Long id);
}
