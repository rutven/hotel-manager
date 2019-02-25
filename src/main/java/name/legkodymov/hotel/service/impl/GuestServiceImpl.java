package name.legkodymov.hotel.service.impl;

import name.legkodymov.hotel.service.GuestService;
import name.legkodymov.hotel.domain.Guest;
import name.legkodymov.hotel.repository.GuestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Guest.
 */
@Service
@Transactional
public class GuestServiceImpl implements GuestService {

    private final Logger log = LoggerFactory.getLogger(GuestServiceImpl.class);

    private final GuestRepository guestRepository;

    public GuestServiceImpl(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    /**
     * Save a guest.
     *
     * @param guest the entity to save
     * @return the persisted entity
     */
    @Override
    public Guest save(Guest guest) {
        log.debug("Request to save Guest : {}", guest);        return guestRepository.save(guest);
    }

    /**
     * Get all the guests.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Guest> findAll() {
        log.debug("Request to get all Guests");
        return guestRepository.findAll();
    }


    /**
     * Get one guest by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Guest> findOne(Long id) {
        log.debug("Request to get Guest : {}", id);
        return guestRepository.findById(id);
    }

    /**
     * Delete the guest by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Guest : {}", id);
        guestRepository.deleteById(id);
    }
}
