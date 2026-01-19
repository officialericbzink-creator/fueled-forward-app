import { UserWithProfile, Profile } from "@/services/api/types"

export type ProfileFormState = Pick<UserWithProfile, "name" | "image"> & {
  profile: Pick<Profile, "bio" | "struggles" | "inTherapy" | "therapyDetails" | "struggleNotes">
} & { isDirty: boolean }

export enum ProfileFormActionType {
  SET_INITIAL_DATA = "SET_INITIAL_DATA",
  UPDATE_NAME = "UPDATE_NAME",
  UPDATE_IMAGE = "UPDATE_IMAGE",
  TOGGLE_STRUGGLE = "TOGGLE_STRUGGLE",
  UPDATE_IN_THERAPY = "UPDATE_IN_THERAPY",
  UPDATE_THERAPY_DETAILS = "UPDATE_THERAPY_DETAILS",
  UPDATE_STRUGGLE_NOTES = "UPDATE_STRUGGLE_NOTES",
  RESET_DIRTY = "RESET_DIRTY",
}

export type ProfileFormAction =
  | { type: ProfileFormActionType.SET_INITIAL_DATA; payload: UserWithProfile }
  | { type: ProfileFormActionType.UPDATE_NAME; payload: string }
  | { type: ProfileFormActionType.UPDATE_IMAGE; payload: string | null }
  | { type: ProfileFormActionType.TOGGLE_STRUGGLE; payload: string }
  | { type: ProfileFormActionType.UPDATE_IN_THERAPY; payload: boolean }
  | { type: ProfileFormActionType.UPDATE_THERAPY_DETAILS; payload: string | null }
  | { type: ProfileFormActionType.UPDATE_STRUGGLE_NOTES; payload: string | null }
  | { type: ProfileFormActionType.RESET_DIRTY }

export const initialFormState: ProfileFormState = {
  name: "",
  image: null,
  profile: {
    bio: null,
    struggles: [],
    inTherapy: false,
    therapyDetails: null,
    struggleNotes: null,
  },
  isDirty: false,
}

export function profileFormReducer(
  state: ProfileFormState,
  action: ProfileFormAction,
): ProfileFormState {
  switch (action.type) {
    case ProfileFormActionType.SET_INITIAL_DATA: {
      const { name, image, profile } = action.payload
      return {
        name: name || "",
        image: image || null,
        profile: {
          bio: profile.bio || null,
          struggles: profile.struggles || [],
          inTherapy: profile.inTherapy,
          therapyDetails: profile.therapyDetails || null,
          struggleNotes: profile.struggleNotes || null,
        },
        isDirty: false,
      }
    }

    case ProfileFormActionType.UPDATE_NAME: {
      // Validation: name cannot be empty
      if (!action.payload || action.payload.trim() === "") {
        return state
      }
      return {
        ...state,
        name: action.payload,
        isDirty: true,
      }
    }

    case ProfileFormActionType.UPDATE_IMAGE: {
      return {
        ...state,
        image: action.payload,
        isDirty: true,
      }
    }

    case ProfileFormActionType.TOGGLE_STRUGGLE: {
      const struggle = action.payload
      const currentStruggles = state.profile.struggles || []
      const newStruggles = currentStruggles.includes(struggle)
        ? currentStruggles.filter((s) => s !== struggle)
        : [...currentStruggles, struggle]

      return {
        ...state,
        profile: {
          ...state.profile,
          struggles: newStruggles,
        },
        isDirty: true,
      }
    }

    case ProfileFormActionType.UPDATE_IN_THERAPY: {
      return {
        ...state,
        profile: {
          ...state.profile,
          inTherapy: action.payload,
        },
        isDirty: true,
      }
    }

    case ProfileFormActionType.UPDATE_THERAPY_DETAILS: {
      return {
        ...state,
        profile: {
          ...state.profile,
          therapyDetails: action.payload,
        },
        isDirty: true,
      }
    }

    case ProfileFormActionType.UPDATE_STRUGGLE_NOTES: {
      return {
        ...state,
        profile: {
          ...state.profile,
          struggleNotes: action.payload,
        },
        isDirty: true,
      }
    }
    case ProfileFormActionType.RESET_DIRTY: {
      return {
        ...state,
        isDirty: false,
      }
    }

    default:
      return state
  }
}
