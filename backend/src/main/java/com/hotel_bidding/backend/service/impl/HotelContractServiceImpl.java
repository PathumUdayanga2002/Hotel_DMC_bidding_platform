package com.hotel_bidding.backend.service.impl;

import com.hotel_bidding.backend.dto.request.ContractRequest;
import com.hotel_bidding.backend.dto.response.ContractResponse;
import com.hotel_bidding.backend.entity.HotelContract;
import com.hotel_bidding.backend.repository.HotelContractRepository;
import com.hotel_bidding.backend.service.HotelContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HotelContractServiceImpl implements HotelContractService {

    private final HotelContractRepository repository;

    // Save contract from entity (existing method)
    @Override
    public HotelContract saveContract(HotelContract contract) {
        return repository.save(contract);
    }

    // Save contract from ContractRequest and return ContractResponse
    public ContractResponse saveContract(ContractRequest request, String hotelId) {
        HotelContract contract = new HotelContract();
        contract.setHotelId(hotelId);

        // Convert nested DTOs to entity
        contract.setGeneral(convertGeneral(request.getGeneral()));
        contract.setRooms(convertRooms(request.getRooms()));
        contract.setMeals(convertMeals(request.getMeals()));
        contract.setChildPolicy(convertChildPolicy(request.getChildPolicy()));
        contract.setOffers(convertOffers(request.getOffers()));
        contract.setValueAdded(convertValueAdded(request.getValueAdded()));
        contract.setTerms(convertTerms(request.getTerms()));

        HotelContract saved = repository.save(contract);
        return mapToResponse(saved);
    }

    @Override
    public List<HotelContract> getContractsByHotel(String hotelId) {
        return repository.findByHotelId(hotelId);
    }

    @Override
    public Optional<HotelContract> getContractByIdAndHotel(String id, String hotelId) {
        return repository.findByIdAndHotelId(id, hotelId);
    }

    @Override
    public void deleteContract(String id, String hotelId) {
        getContractByIdAndHotel(id, hotelId).ifPresent(repository::delete);
    }

    // -----------------------
    // Mapper Methods
    // -----------------------

    private HotelContract.General convertGeneral(ContractRequest.General generalRequest) {
        if (generalRequest == null) return null;

        HotelContract.General general = new HotelContract.General();
        general.setContractName(generalRequest.getContractName());
        general.setHotelName(generalRequest.getHotelName());
        general.setStartDate(generalRequest.getStartDate());
        general.setEndDate(generalRequest.getEndDate());
        general.setRateBasis(generalRequest.getRateBasis());
        general.setCurrency(generalRequest.getCurrency());
        general.setInclusivity(generalRequest.getInclusivity());
        general.setOnlineMarkupPolicy(generalRequest.getOnlineMarkupPolicy());
        general.setGovernmentTaxNote(generalRequest.getGovernmentTaxNote());
        general.setPeakPeriods(convertPeakPeriods(generalRequest.getPeakPeriods()));
        return general;
    }

    private List<HotelContract.Room> convertRooms(List<ContractRequest.Room> rooms) {
        if (rooms == null) return null;
        return rooms.stream().map(r -> {
            HotelContract.Room room = new HotelContract.Room();
            room.setName(r.getName());
            room.setUnits(r.getUnits());
            room.setMaxPax(r.getMaxPax());
            room.setRatePeriods(convertRatePeriods(r.getRatePeriods()));
            return room;
        }).toList();
    }

    private List<HotelContract.Room.RatePeriod> convertRatePeriods(List<ContractRequest.Room.RatePeriod> ratePeriods) {
        if (ratePeriods == null) return null;
        return ratePeriods.stream().map(rp -> {
            HotelContract.Room.RatePeriod period = new HotelContract.Room.RatePeriod();
            period.setPeriodName(rp.getPeriodName());
            period.setStartDate(rp.getStartDate());
            period.setEndDate(rp.getEndDate());
            period.setRateSingle(rp.getRateSingle());
            period.setRateDouble(rp.getRateDouble());
            period.setRateTriple(rp.getRateTriple());
            period.setMinNights(rp.getMinNights());
            return period;
        }).toList();
    }

    private List<HotelContract.MealSupplement> convertMeals(List<ContractRequest.MealSupplement> meals) {
        if (meals == null) return null;
        return meals.stream().map(m -> {
            HotelContract.MealSupplement meal = new HotelContract.MealSupplement();
            meal.setType(m.getType());
            meal.setDescription(m.getDescription());
            meal.setMandatory(m.isMandatory());
            meal.setCost(m.getCost());
            meal.setCostBasis(m.getCostBasis());
            meal.setChildDiscountPercent(m.getChildDiscountPercent());
            return meal;
        }).toList();
    }

    private HotelContract.ChildPolicy convertChildPolicy(ContractRequest.ChildPolicy cp) {
        if (cp == null) return null;
        HotelContract.ChildPolicy childPolicy = new HotelContract.ChildPolicy();
        childPolicy.setChildFOCAgeMax(cp.getChildFOCAgeMax());
        childPolicy.setChildFOCConditions(cp.getChildFOCConditions());
        childPolicy.setChildMealDiscountAgeRange(cp.getChildMealDiscountAgeRange());
        childPolicy.setChildMealDiscountPercent(cp.getChildMealDiscountPercent());
        childPolicy.setExtraBedChargeAge(cp.getExtraBedChargeAge());
        childPolicy.setExtraBedCost(cp.getExtraBedCost());
        childPolicy.setExtraAdultDefinition(cp.getExtraAdultDefinition());
        childPolicy.setExtraAdultRate(cp.getExtraAdultRate());
        childPolicy.setDriverAccommodation(cp.getDriverAccommodation());
        childPolicy.setDriverAllowanceAmount(cp.getDriverAllowanceAmount());
        childPolicy.setDriverAllowanceCurrency(cp.getDriverAllowanceCurrency());
        return childPolicy;
    }

    private List<HotelContract.Offer> convertOffers(List<ContractRequest.Offer> offers) {
        if (offers == null) return null;
        return offers.stream().map(o -> {
            HotelContract.Offer offer = new HotelContract.Offer();
            offer.setName(o.getName());
            offer.setCondition(o.getCondition());
            offer.setDiscountPercent(o.getDiscountPercent());
            offer.setCombinable(o.isCombinable());
            offer.setExclusionPeriodName(o.getExclusionPeriodName());
            offer.setRelatedPolicy(o.getRelatedPolicy());
            return offer;
        }).toList();
    }

    private List<HotelContract.ValueAddedService> convertValueAdded(List<ContractRequest.ValueAddedService> vals) {
        if (vals == null) return null;
        return vals.stream().map(v -> {
            HotelContract.ValueAddedService val = new HotelContract.ValueAddedService();
            val.setServiceName(v.getServiceName());
            val.setApplicableStay(v.getApplicableStay());
            val.setGuestType(v.getGuestType());
            val.setRequiredMealBasis(v.getRequiredMealBasis());
            val.setHoneymoonCondition(v.getHoneymoonCondition());
            return val;
        }).toList();
    }

    private List<HotelContract.TermCondition> convertTerms(List<ContractRequest.TermCondition> terms) {
        if (terms == null) return null;
        return terms.stream().map(t -> {
            HotelContract.TermCondition term = new HotelContract.TermCondition();
            term.setType(t.getType());
            term.setApplicablePeriod(t.getApplicablePeriod());
            term.setConditionDays(t.getConditionDays());
            term.setPolicyDetail(t.getPolicyDetail());
            return term;
        }).toList();
    }

    private List<HotelContract.General.PeakPeriod> convertPeakPeriods(List<ContractRequest.General.PeakPeriod> peaks) {
        if (peaks == null) return null;
        return peaks.stream().map(p -> {
            HotelContract.General.PeakPeriod peak = new HotelContract.General.PeakPeriod();
            peak.setName(p.getName());
            peak.setStartDate(p.getStartDate());
            peak.setEndDate(p.getEndDate());
            return peak;
        }).toList();
    }

    private ContractResponse mapToResponse(HotelContract entity) {
        if (entity == null) return null;

        ContractResponse response = new ContractResponse();
        response.setId(entity.getId());
        response.setHotelId(entity.getHotelId());

        if (entity.getGeneral() != null) {
            ContractResponse.General general = new ContractResponse.General();
            general.setContractName(entity.getGeneral().getContractName());
            general.setHotelName(entity.getGeneral().getHotelName());
            general.setStartDate(entity.getGeneral().getStartDate());
            general.setEndDate(entity.getGeneral().getEndDate());
            general.setRateBasis(entity.getGeneral().getRateBasis());
            general.setCurrency(entity.getGeneral().getCurrency());
            general.setInclusivity(entity.getGeneral().getInclusivity());
            general.setOnlineMarkupPolicy(entity.getGeneral().getOnlineMarkupPolicy());
            general.setGovernmentTaxNote(entity.getGeneral().getGovernmentTaxNote());
            general.setPeakPeriods(entity.getGeneral().getPeakPeriods());
            response.setGeneral(general);
        }

        response.setRooms(entity.getRooms());
        response.setMeals(entity.getMeals());
        response.setChildPolicy(entity.getChildPolicy());
        response.setOffers(entity.getOffers());
        response.setValueAdded(entity.getValueAdded());
        response.setTerms(entity.getTerms());

        return response;
    }
}
