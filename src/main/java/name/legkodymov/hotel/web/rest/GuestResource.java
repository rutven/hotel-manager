package name.legkodymov.hotel.web.rest;

import com.codahale.metrics.annotation.Timed;
import name.legkodymov.hotel.domain.Guest;
import name.legkodymov.hotel.service.GuestService;
import name.legkodymov.hotel.web.rest.errors.BadRequestAlertException;
import name.legkodymov.hotel.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Guest.
 */
@RestController
@RequestMapping("/api")
public class GuestResource {

    private final Logger log = LoggerFactory.getLogger(GuestResource.class);

    private static final String ENTITY_NAME = "guest";

    private final GuestService guestService;

    public GuestResource(GuestService guestService) {
        this.guestService = guestService;
    }

    /**
     * POST  /guests : Create a new guest.
     *
     * @param guest the guest to create
     * @return the ResponseEntity with status 201 (Created) and with body the new guest, or with status 400 (Bad Request) if the guest has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/guests")
    @Timed
    public ResponseEntity<Guest> createGuest(@RequestBody Guest guest) throws URISyntaxException {
        log.debug("REST request to save Guest : {}", guest);
        if (guest.getId() != null) {
            throw new BadRequestAlertException("A new guest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Guest result = guestService.save(guest);
        return ResponseEntity.created(new URI("/api/guests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /guests : Updates an existing guest.
     *
     * @param guest the guest to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated guest,
     * or with status 400 (Bad Request) if the guest is not valid,
     * or with status 500 (Internal Server Error) if the guest couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/guests")
    @Timed
    public ResponseEntity<Guest> updateGuest(@RequestBody Guest guest) throws URISyntaxException {
        log.debug("REST request to update Guest : {}", guest);
        if (guest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Guest result = guestService.save(guest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, guest.getId().toString()))
            .body(result);
    }

    /**
     * GET  /guests : get all the guests.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of guests in body
     */
    @GetMapping("/guests")
    @Timed
    public List<Guest> getAllGuests() {
        log.debug("REST request to get all Guests");
        return guestService.findAll();
    }

    /**
     * GET  /guests/:id : get the "id" guest.
     *
     * @param id the id of the guest to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the guest, or with status 404 (Not Found)
     */
    @GetMapping("/guests/{id}")
    @Timed
    public ResponseEntity<Guest> getGuest(@PathVariable Long id) {
        log.debug("REST request to get Guest : {}", id);
        Optional<Guest> guest = guestService.findOne(id);
        return ResponseUtil.wrapOrNotFound(guest);
    }

    /**
     * DELETE  /guests/:id : delete the "id" guest.
     *
     * @param id the id of the guest to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/guests/{id}")
    @Timed
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        log.debug("REST request to delete Guest : {}", id);
        guestService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
