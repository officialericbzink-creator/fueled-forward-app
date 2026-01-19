import { useMutation, useQueryClient } from "@tanstack/react-query"

import { goalsApi } from "@/services/api"
import type { CreateGoal, Goal } from "@/services/api/types"

export const useDailyGoalsActions = () => {
  const queryClient = useQueryClient()

  const createGoal = useMutation({
    mutationFn: (goalData: CreateGoal) => goalsApi.createGoal(goalData),
    onMutate: async (newGoal) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["daily-goals"] })

      // Snapshot the previous value
      const previousGoals = queryClient.getQueryData(["daily-goals"])

      // Optimistically update to the new value
      queryClient.setQueryData(["daily-goals"], (old: any) => {
        if (!old) return old

        const optimisticGoal: Goal = {
          id: `temp-${Date.now()}`,
          userId: "temp-user",
          goal: newGoal.goal,
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return {
          data: [optimisticGoal, ...old.data],
          count: old.count + 1,
        }
      })

      return { previousGoals }
    },
    onError: (err, newGoal, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData(["daily-goals"], context.previousGoals)
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["daily-goals"] })
    },
  })

  const toggleGoal = useMutation({
    mutationFn: (goalId: string) => goalsApi.toggleGoal(goalId),
    onMutate: async (goalId) => {
      await queryClient.cancelQueries({ queryKey: ["daily-goals"] })

      const previousGoals = queryClient.getQueryData(["daily-goals"])

      // Optimistically update the goal
      queryClient.setQueryData(["daily-goals"], (old: any) => {
        if (!old) return old

        return {
          data: old.data.map((goal: Goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  completed: !goal.completed,
                  completedAt: !goal.completed ? new Date().toISOString() : null,
                }
              : goal,
          ),
          count: old.count,
        }
      })

      return { previousGoals }
    },
    onError: (err, goalId, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["daily-goals"], context.previousGoals)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-goals"] })
    },
  })

  const deleteGoal = useMutation({
    mutationFn: (goalId: string) => goalsApi.deleteGoal(goalId),
    onMutate: async (goalId) => {
      await queryClient.cancelQueries({ queryKey: ["daily-goals"] })

      const previousGoals = queryClient.getQueryData(["daily-goals"])

      // Optimistically remove the goal
      queryClient.setQueryData(["daily-goals"], (old: any) => {
        if (!old) return old

        return {
          data: old.data.filter((goal: Goal) => goal.id !== goalId),
          count: old.count - 1,
        }
      })

      return { previousGoals }
    },
    onError: (err, goalId, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["daily-goals"], context.previousGoals)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-goals"] })
    },
  })

  return {
    createGoal,
    toggleGoal,
    deleteGoal,
  }
}
