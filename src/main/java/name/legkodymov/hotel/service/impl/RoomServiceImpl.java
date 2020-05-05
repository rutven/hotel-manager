package name.legkodymov.hotel.service.impl;

import name.legkodymov.hotel.service.RoomService;
import name.legkodymov.hotel.domain.Room;
import name.legkodymov.hotel.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service Implementation for managing {@link Room}.
 */
@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    private final Logger log = LoggerFactory.getLogger(RoomServiceImpl.class);

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
     * Save a room.
     *
     * @param room the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Room save(Room room) {
        log.debug("Request to save Room : {}", room);
        return roomRepository.save(room);
    }

    /**
     * Get all the rooms.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Room> findAll() {
        log.debug("Request to get all Rooms");
        return roomRepository.findAll();
    }


    /**
     *  Get all the rooms where Reservation is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true) 
    public List<Room> findAllWhereReservationIsNull() {
        log.debug("Request to get all rooms where Reservation is null");
        return StreamSupport
            .stream(roomRepository.findAll().spliterator(), false)
            .filter(room -> room.getReservation() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one room by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Room> findOne(Long id) {
        log.debug("Request to get Room : {}", id);
        return roomRepository.findById(id);
    }

    /**
     * Delete the room by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Room : {}", id);
        roomRepository.deleteById(id);
    }
}
