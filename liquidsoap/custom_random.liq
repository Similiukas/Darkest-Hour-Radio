# At the beginning of every track, select a random ready child.
# @category Source / Track Processing
# @param ~id Force the value of the source ID.
# @param ~override Metadata field which, if present and containing a float, overrides the `transition_length` parameter.
# @param ~replay_metadata Replay the last metadata of a child when switching to it in the middle of a track.
# @param ~transition_length Maximum transition duration.
# @param ~transitions Transition functions, padded with `fun (x,y) -> y` functions.
# @param ~weights Weights of the children (padded with 1), defining for each child the probability that it is selected.
def custom_random(~id=null(), ~override="liq_transition_length", ~replay_metadata=true,
           ~transition_length=5., ~transitions=[], ~min_tracks=1,
           ~weights=[], sources) =
  weights = list.map(getter.function, weights)
  default_weight = fun () -> 1
  next_index = ref(-1)

  # Custom here
  tracks_to_play_left = ref(min_tracks)

  def pick() =
    def available_weighted_sources(cur, s) =
      let (index, current_weight, indexes) = cur
      weight = list.nth(default=default_weight, weights, index)

      let (current_weight, indexes) =
        if source.is_ready(s) then
          weight = weight()
          indexes = (current_weight, current_weight+weight, index) :: indexes
          (current_weight + weight, indexes)
        else
          (current_weight, indexes)
        end

      (index+1, current_weight, indexes)
    end

    let (_, total_weight, weighted_indexes)  =
      list.fold(available_weighted_sources, (0, 0, []), sources)

      picked_weight =
      if total_weight > 0 then
        random.int(min=0, max=total_weight)
      else
        0
      end

    def pick_source(picked_index, el) =
      let (lower_bound, upper_bound, index) = el

      if lower_bound <= picked_weight and picked_weight < upper_bound then
        index
      else
         picked_index
      end
    end

    next_index := list.fold(pick_source, -1, weighted_indexes)
  end

  def add_condition(index, s) =
    def cond() =
      if !next_index == -1 then pick() end
      !next_index == index
    end

    (cond, s)
  end

  s = switch(override=override, replay_metadata=replay_metadata, track_sensitive=true,
             transition_length=transition_length, transitions=transitions,
             list.mapi(add_condition, sources))

  def f(_) =
    # 80% of the time we reduce tracks_left_to_play by 1
    if random.int(min=1, max=10) < 9 then
      tracks_to_play_left := !tracks_to_play_left - 1
    end

    # If tracks_left_to_play is not-positive, then we leave the old code,
    # which allowed the random() function to choose playlists
    if !tracks_to_play_left <= 0 then
        next_index := -1
        tracks_to_play_left := min_tracks
    end
    # Old code: next_index := -1
  end

  s = source.on_track(s, f)

  def replaces s =
    fallback(id=id, track_sensitive=true, s::sources)
  end

  s
end