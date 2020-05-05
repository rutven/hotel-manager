package name.legkodymov.hotel.web.rest;

import name.legkodymov.hotel.MainApp;
import name.legkodymov.hotel.domain.Room;
import name.legkodymov.hotel.repository.RoomRepository;
import name.legkodymov.hotel.service.RoomService;
import name.legkodymov.hotel.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static name.legkodymov.hotel.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import name.legkodymov.hotel.domain.enumeration.RoomType;
/**
 * Integration tests for the {@Link RoomResource} REST controller.
 */
@SpringBootTest(classes = MainApp.class)
public class RoomResourceIT {

    private static final Integer DEFAULT_ROOM_NUMBER = 1;
    private static final Integer UPDATED_ROOM_NUMBER = 2;

    private static final RoomType DEFAULT_ROOM_TYPE = RoomType.STANDARD;
    private static final RoomType UPDATED_ROOM_TYPE = RoomType.COMFORT;

    private static final Integer DEFAULT_FLOOR = 0;
    private static final Integer UPDATED_FLOOR = 1;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restRoomMockMvc;

    private Room room;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RoomResource roomResource = new RoomResource(roomService);
        this.restRoomMockMvc = MockMvcBuilders.standaloneSetup(roomResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Room createEntity(EntityManager em) {
        Room room = new Room()
            .roomNumber(DEFAULT_ROOM_NUMBER)
            .roomType(DEFAULT_ROOM_TYPE)
            .floor(DEFAULT_FLOOR);
        return room;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Room createUpdatedEntity(EntityManager em) {
        Room room = new Room()
            .roomNumber(UPDATED_ROOM_NUMBER)
            .roomType(UPDATED_ROOM_TYPE)
            .floor(UPDATED_FLOOR);
        return room;
    }

    @BeforeEach
    public void initTest() {
        room = createEntity(em);
    }

    @Test
    @Transactional
    public void createRoom() throws Exception {
        int databaseSizeBeforeCreate = roomRepository.findAll().size();

        // Create the Room
        restRoomMockMvc.perform(post("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(room)))
            .andExpect(status().isCreated());

        // Validate the Room in the database
        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeCreate + 1);
        Room testRoom = roomList.get(roomList.size() - 1);
        assertThat(testRoom.getRoomNumber()).isEqualTo(DEFAULT_ROOM_NUMBER);
        assertThat(testRoom.getRoomType()).isEqualTo(DEFAULT_ROOM_TYPE);
        assertThat(testRoom.getFloor()).isEqualTo(DEFAULT_FLOOR);
    }

    @Test
    @Transactional
    public void createRoomWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = roomRepository.findAll().size();

        // Create the Room with an existing ID
        room.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoomMockMvc.perform(post("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(room)))
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkRoomNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = roomRepository.findAll().size();
        // set the field null
        room.setRoomNumber(null);

        // Create the Room, which fails.

        restRoomMockMvc.perform(post("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(room)))
            .andExpect(status().isBadRequest());

        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFloorIsRequired() throws Exception {
        int databaseSizeBeforeTest = roomRepository.findAll().size();
        // set the field null
        room.setFloor(null);

        // Create the Room, which fails.

        restRoomMockMvc.perform(post("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(room)))
            .andExpect(status().isBadRequest());

        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRooms() throws Exception {
        // Initialize the database
        roomRepository.saveAndFlush(room);

        // Get all the roomList
        restRoomMockMvc.perform(get("/api/rooms?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(room.getId().intValue())))
            .andExpect(jsonPath("$.[*].roomNumber").value(hasItem(DEFAULT_ROOM_NUMBER)))
            .andExpect(jsonPath("$.[*].roomType").value(hasItem(DEFAULT_ROOM_TYPE.toString())))
            .andExpect(jsonPath("$.[*].floor").value(hasItem(DEFAULT_FLOOR)));
    }
    
    @Test
    @Transactional
    public void getRoom() throws Exception {
        // Initialize the database
        roomRepository.saveAndFlush(room);

        // Get the room
        restRoomMockMvc.perform(get("/api/rooms/{id}", room.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(room.getId().intValue()))
            .andExpect(jsonPath("$.roomNumber").value(DEFAULT_ROOM_NUMBER))
            .andExpect(jsonPath("$.roomType").value(DEFAULT_ROOM_TYPE.toString()))
            .andExpect(jsonPath("$.floor").value(DEFAULT_FLOOR));
    }

    @Test
    @Transactional
    public void getNonExistingRoom() throws Exception {
        // Get the room
        restRoomMockMvc.perform(get("/api/rooms/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRoom() throws Exception {
        // Initialize the database
        roomService.save(room);

        int databaseSizeBeforeUpdate = roomRepository.findAll().size();

        // Update the room
        Room updatedRoom = roomRepository.findById(room.getId()).get();
        // Disconnect from session so that the updates on updatedRoom are not directly saved in db
        em.detach(updatedRoom);
        updatedRoom
            .roomNumber(UPDATED_ROOM_NUMBER)
            .roomType(UPDATED_ROOM_TYPE)
            .floor(UPDATED_FLOOR);

        restRoomMockMvc.perform(put("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRoom)))
            .andExpect(status().isOk());

        // Validate the Room in the database
        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeUpdate);
        Room testRoom = roomList.get(roomList.size() - 1);
        assertThat(testRoom.getRoomNumber()).isEqualTo(UPDATED_ROOM_NUMBER);
        assertThat(testRoom.getRoomType()).isEqualTo(UPDATED_ROOM_TYPE);
        assertThat(testRoom.getFloor()).isEqualTo(UPDATED_FLOOR);
    }

    @Test
    @Transactional
    public void updateNonExistingRoom() throws Exception {
        int databaseSizeBeforeUpdate = roomRepository.findAll().size();

        // Create the Room

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoomMockMvc.perform(put("/api/rooms")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(room)))
            .andExpect(status().isBadRequest());

        // Validate the Room in the database
        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteRoom() throws Exception {
        // Initialize the database
        roomService.save(room);

        int databaseSizeBeforeDelete = roomRepository.findAll().size();

        // Delete the room
        restRoomMockMvc.perform(delete("/api/rooms/{id}", room.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Room> roomList = roomRepository.findAll();
        assertThat(roomList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Room.class);
        Room room1 = new Room();
        room1.setId(1L);
        Room room2 = new Room();
        room2.setId(room1.getId());
        assertThat(room1).isEqualTo(room2);
        room2.setId(2L);
        assertThat(room1).isNotEqualTo(room2);
        room1.setId(null);
        assertThat(room1).isNotEqualTo(room2);
    }
}
