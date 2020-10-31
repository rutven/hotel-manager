package name.legkodymov.hotel.web.rest;

import name.legkodymov.hotel.MainApp;
import name.legkodymov.hotel.domain.Guest;
import name.legkodymov.hotel.repository.GuestRepository;
import name.legkodymov.hotel.service.GuestService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link GuestResource} REST controller.
 */
@SpringBootTest(classes = MainApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class GuestResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private GuestService guestService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGuestMockMvc;

    private Guest guest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guest createEntity(EntityManager em) {
        Guest guest = new Guest()
            .name(DEFAULT_NAME)
            .phone(DEFAULT_PHONE)
            .email(DEFAULT_EMAIL);
        return guest;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guest createUpdatedEntity(EntityManager em) {
        Guest guest = new Guest()
            .name(UPDATED_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL);
        return guest;
    }

    @BeforeEach
    public void initTest() {
        guest = createEntity(em);
    }

    @Test
    @Transactional
    public void createGuest() throws Exception {
        int databaseSizeBeforeCreate = guestRepository.findAll().size();
        // Create the Guest
        restGuestMockMvc.perform(post("/api/guests")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(guest)))
            .andExpect(status().isCreated());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeCreate + 1);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGuest.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testGuest.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createGuestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = guestRepository.findAll().size();

        // Create the Guest with an existing ID
        guest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGuestMockMvc.perform(post("/api/guests")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(guest)))
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGuests() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        // Get all the guestList
        restGuestMockMvc.perform(get("/api/guests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(guest.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
    
    @Test
    @Transactional
    public void getGuest() throws Exception {
        // Initialize the database
        guestRepository.saveAndFlush(guest);

        // Get the guest
        restGuestMockMvc.perform(get("/api/guests/{id}", guest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(guest.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }
    @Test
    @Transactional
    public void getNonExistingGuest() throws Exception {
        // Get the guest
        restGuestMockMvc.perform(get("/api/guests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGuest() throws Exception {
        // Initialize the database
        guestService.save(guest);

        int databaseSizeBeforeUpdate = guestRepository.findAll().size();

        // Update the guest
        Guest updatedGuest = guestRepository.findById(guest.getId()).get();
        // Disconnect from session so that the updates on updatedGuest are not directly saved in db
        em.detach(updatedGuest);
        updatedGuest
            .name(UPDATED_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL);

        restGuestMockMvc.perform(put("/api/guests")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedGuest)))
            .andExpect(status().isOk());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
        Guest testGuest = guestList.get(guestList.size() - 1);
        assertThat(testGuest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGuest.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testGuest.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void updateNonExistingGuest() throws Exception {
        int databaseSizeBeforeUpdate = guestRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuestMockMvc.perform(put("/api/guests")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(guest)))
            .andExpect(status().isBadRequest());

        // Validate the Guest in the database
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGuest() throws Exception {
        // Initialize the database
        guestService.save(guest);

        int databaseSizeBeforeDelete = guestRepository.findAll().size();

        // Delete the guest
        restGuestMockMvc.perform(delete("/api/guests/{id}", guest.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Guest> guestList = guestRepository.findAll();
        assertThat(guestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
