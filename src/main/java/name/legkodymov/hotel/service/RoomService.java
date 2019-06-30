package name.legkodymov.hotel.service;

import name.legkodymov.hotel.domain.Room;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Room}.
 */
public interface RoomService {

    /**
     * Save a room.
     *
     * @param room the entity to save.
     * @return the persisted entity.
     */
    Room save(Room room);

    /**
     * Get all the rooms.
     *
     * @return the list of entities.
     */
    List<Room> findAll();
    /**
     * Get all the RoomDTO where Reservation is {@code null}.
     *
     * @return the list of entities.
     */
    List<Room> findAllWhereReservationIsNull();


    /**
     * Get the "id" room.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Room> findOne(Long id);

    /**
     * Delete the "id" room.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
