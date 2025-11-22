package com.hotel_bidding.backend.controller;

import com.hotel_bidding.backend.dto.request.ContractRequest;
import com.hotel_bidding.backend.dto.response.ContractResponse;
import com.hotel_bidding.backend.entity.HotelContract;
import com.hotel_bidding.backend.repository.UserRepository;
import com.hotel_bidding.backend.service.HotelContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hotel/contracts")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('HOTEL_USER')")
public class HotelContractController {

    private final HotelContractService contractService;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    private String resolveHotelId(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ContractResponse> createContract(
            @Valid @RequestBody ContractRequest request,
            Authentication authentication) {

        String hotelId = resolveHotelId(authentication);
        HotelContract entity = mapRequestToEntity(request);
        entity.setHotelId(hotelId);

        HotelContract saved = contractService.saveContract(entity);
        ContractResponse resp = mapEntityToResponse(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ContractResponse>> getMyContracts(Authentication authentication) {
        String hotelId = resolveHotelId(authentication);
        List<HotelContract> list = contractService.getContractsByHotel(hotelId);
        List<ContractResponse> resp = list.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable String id, Authentication authentication) {
        String hotelId = resolveHotelId(authentication);
        return contractService.getContractByIdAndHotel(id, hotelId)
                .map(c -> ResponseEntity.ok(mapEntityToResponse(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable String id, Authentication authentication) {
        String hotelId = resolveHotelId(authentication);
        contractService.deleteContract(id, hotelId);
        return ResponseEntity.noContent().build();
    }

    // -------------------------
    // Mapping helpers
    // -------------------------
    private HotelContract mapRequestToEntity(ContractRequest req) {
        HotelContract contract = new HotelContract();

        // General
        if (req.getGeneral() != null) {
            HotelContract.General gen = new HotelContract.General();
            gen.setContractName(req.getGeneral().getContractName());
            gen.setHotelName(req.getGeneral().getHotelName());
            gen.setStartDate(req.getGeneral().getStartDate());
            gen.setEndDate(req.getGeneral().getEndDate());
            gen.setRateBasis(req.getGeneral().getRateBasis());
            gen.setCurrency(req.getGeneral().getCurrency());
            gen.setInclusivity(req.getGeneral().getInclusivity());
            gen.setOnlineMarkupPolicy(req.getGeneral().getOnlineMarkupPolicy());
            gen.setGovernmentTaxNote(req.getGeneral().getGovernmentTaxNote());

            if (req.getGeneral().getPeakPeriods() != null) {
                gen.setPeakPeriods(req.getGeneral().getPeakPeriods().stream().map(p -> {
                    HotelContract.General.PeakPeriod peak = new HotelContract.General.PeakPeriod();
                    peak.setName(p.getName());
                    peak.setStartDate(p.getStartDate());
                    peak.setEndDate(p.getEndDate());
                    return peak;
                }).toList());
            }

            contract.setGeneral(gen);
        }

        // Rooms
        if (req.getRooms() != null) {
            contract.setRooms(req.getRooms().stream().map(r -> {
                HotelContract.Room room = new HotelContract.Room();
                room.setName(r.getName());
                room.setUnits(r.getUnits());
                room.setMaxPax(r.getMaxPax());
                if (r.getRatePeriods() != null) {
                    room.setRatePeriods(r.getRatePeriods().stream().map(rp -> {
                        HotelContract.Room.RatePeriod period = new HotelContract.Room.RatePeriod();
                        period.setPeriodName(rp.getPeriodName());
                        period.setStartDate(rp.getStartDate());
                        period.setEndDate(rp.getEndDate());
                        period.setRateSingle(rp.getRateSingle());
                        period.setRateDouble(rp.getRateDouble());
                        period.setRateTriple(rp.getRateTriple());
                        period.setMinNights(rp.getMinNights());
                        return period;
                    }).toList());
                }
                return room;
            }).toList());
        }

        // Meals
        if (req.getMeals() != null) {
            contract.setMeals(req.getMeals().stream().map(m -> {
                HotelContract.MealSupplement meal = new HotelContract.MealSupplement();
                meal.setType(m.getType());
                meal.setDescription(m.getDescription());
                meal.setMandatory(m.isMandatory());
                meal.setCost(m.getCost());
                meal.setCostBasis(m.getCostBasis());
                meal.setChildDiscountPercent(m.getChildDiscountPercent());
                return meal;
            }).toList());
        }

        // ChildPolicy
        if (req.getChildPolicy() != null) {
            HotelContract.ChildPolicy cp = new HotelContract.ChildPolicy();
            cp.setChildFOCAgeMax(req.getChildPolicy().getChildFOCAgeMax());
            cp.setChildFOCConditions(req.getChildPolicy().getChildFOCConditions());
            cp.setChildMealDiscountAgeRange(req.getChildPolicy().getChildMealDiscountAgeRange());
            cp.setChildMealDiscountPercent(req.getChildPolicy().getChildMealDiscountPercent());
            cp.setExtraBedChargeAge(req.getChildPolicy().getExtraBedChargeAge());
            cp.setExtraBedCost(req.getChildPolicy().getExtraBedCost());
            cp.setExtraAdultDefinition(req.getChildPolicy().getExtraAdultDefinition());
            cp.setExtraAdultRate(req.getChildPolicy().getExtraAdultRate());
            cp.setDriverAccommodation(req.getChildPolicy().getDriverAccommodation());
            cp.setDriverAllowanceAmount(req.getChildPolicy().getDriverAllowanceAmount());
            cp.setDriverAllowanceCurrency(req.getChildPolicy().getDriverAllowanceCurrency());
            contract.setChildPolicy(cp);
        }

        // Offers
        if (req.getOffers() != null) {
            contract.setOffers(req.getOffers().stream().map(o -> {
                HotelContract.Offer offer = new HotelContract.Offer();
                offer.setName(o.getName());
                offer.setCondition(o.getCondition());
                offer.setDiscountPercent(o.getDiscountPercent());
                offer.setCombinable(o.isCombinable());
                offer.setExclusionPeriodName(o.getExclusionPeriodName());
                offer.setRelatedPolicy(o.getRelatedPolicy());
                return offer;
            }).toList());
        }

        // ValueAdded
        if (req.getValueAdded() != null) {
            contract.setValueAdded(req.getValueAdded().stream().map(v -> {
                HotelContract.ValueAddedService val = new HotelContract.ValueAddedService();
                val.setServiceName(v.getServiceName());
                val.setApplicableStay(v.getApplicableStay());
                val.setGuestType(v.getGuestType());
                val.setRequiredMealBasis(v.getRequiredMealBasis());
                val.setHoneymoonCondition(v.getHoneymoonCondition());
                return val;
            }).toList());
        }

        // Terms
        if (req.getTerms() != null) {
            contract.setTerms(req.getTerms().stream().map(t -> {
                HotelContract.TermCondition term = new HotelContract.TermCondition();
                term.setType(t.getType());
                term.setApplicablePeriod(t.getApplicablePeriod());
                term.setConditionDays(t.getConditionDays());
                term.setPolicyDetail(t.getPolicyDetail());
                return term;
            }).toList());
        }

        return contract;
    }

    private ContractResponse mapEntityToResponse(HotelContract c) {
        ContractResponse r = new ContractResponse();
        r.setId(c.getId());
        r.setHotelId(c.getHotelId());
        r.setGeneral(modelMapper.map(c.getGeneral(), ContractResponse.General.class));

        // Correctly assign types without casting
        r.setRooms(c.getRooms());
        r.setMeals(c.getMeals());
        r.setChildPolicy(c.getChildPolicy());
        r.setOffers(c.getOffers());
        r.setValueAdded(c.getValueAdded());
        r.setTerms(c.getTerms());

        return r;
    }
}
