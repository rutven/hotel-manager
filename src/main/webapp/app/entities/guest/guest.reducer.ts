import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IGuest, defaultValue } from 'app/shared/model/guest.model';

export const ACTION_TYPES = {
  FETCH_GUEST_LIST: 'guest/FETCH_GUEST_LIST',
  FETCH_GUEST: 'guest/FETCH_GUEST',
  CREATE_GUEST: 'guest/CREATE_GUEST',
  UPDATE_GUEST: 'guest/UPDATE_GUEST',
  DELETE_GUEST: 'guest/DELETE_GUEST',
  RESET: 'guest/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IGuest>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type GuestState = Readonly<typeof initialState>;

// Reducer

export default (state: GuestState = initialState, action): GuestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_GUEST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_GUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_GUEST):
    case REQUEST(ACTION_TYPES.UPDATE_GUEST):
    case REQUEST(ACTION_TYPES.DELETE_GUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_GUEST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_GUEST):
    case FAILURE(ACTION_TYPES.CREATE_GUEST):
    case FAILURE(ACTION_TYPES.UPDATE_GUEST):
    case FAILURE(ACTION_TYPES.DELETE_GUEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_GUEST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_GUEST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_GUEST):
    case SUCCESS(ACTION_TYPES.UPDATE_GUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_GUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/guests';

// Actions

export const getEntities: ICrudGetAllAction<IGuest> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_GUEST_LIST,
  payload: axios.get<IGuest>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IGuest> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_GUEST,
    payload: axios.get<IGuest>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IGuest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_GUEST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IGuest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_GUEST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IGuest> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_GUEST,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
