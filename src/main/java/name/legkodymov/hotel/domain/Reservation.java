package name.legkodymov.hotel.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Min(value = 1)
    @Column(name = "days")
    private Integer days;

    @OneToOne
    @JoinColumn(unique = true)
    private Room room;

    @ManyToOne
    @JsonIgnoreProperties("reservations")
    private Guest guest;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public Reservation startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Integer getDays() {
        return days;
    }

    public Reservation days(Integer days) {
        this.days = days;
        return this;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Room getRoom() {
        return room;
    }

    public Reservation room(Room room) {
        this.room = room;
        return this;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Guest getGuest() {
        return guest;
    }

    public Reservation guest(Guest guest) {
        this.guest = guest;
        return this;
    }

    public void setGuest(Guest guest) {
        this.guest = guest;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return id != null && id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", days=" + getDays() +
            "}";
    }
}
